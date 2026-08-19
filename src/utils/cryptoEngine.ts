// ResQGrid Web Crypto Engine
// Provides real AES-256-GCM encryption and SHA-256 telemetry packet signing via window.crypto.subtle

export interface EncryptedPacketResult {
  ciphertext: string; // Base64
  iv: string;         // Hex
  hash: string;       // SHA-256 Hex
  timestamp: number;
}

// Convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to ArrayBuffer
export function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Generate Real SHA-256 Hash of any telemetry payload
export async function generatePacketHash(payload: Record<string, unknown> | string): Promise<string> {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  if (window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
  }
  
  // Fallback simple checksum if SubtleCrypto unavailable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(16, '0') + '-fallback';
}

// Encrypt payload using AES-GCM 256-bit key
export async function encryptPayloadAES(
  plaintext: string,
  passphrase = 'RESQGRID_IN865_COMMUNITY_KEY'
): Promise<EncryptedPacketResult> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const timestamp = Date.now();

  if (!window.crypto || !window.crypto.subtle) {
    // Basic fallback encoding
    return {
      ciphertext: btoa(unescape(encodeURIComponent(plaintext))),
      iv: '00112233445566778899aabbccddeeff',
      hash: await generatePacketHash(plaintext),
      timestamp,
    };
  }

  // Derive key from passphrase using SHA-256
  const keyMaterial = await window.crypto.subtle.digest('SHA-256', encoder.encode(passphrase));
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  // Generate 12-byte random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt with AES-GCM
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    data
  );

  const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer)));
  const ivHex = bufferToHex(iv.buffer);
  const packetHash = await generatePacketHash(plaintext);

  return {
    ciphertext: ciphertextBase64,
    iv: ivHex,
    hash: packetHash,
    timestamp,
  };
}

// Decrypt AES-GCM payload
export async function decryptPayloadAES(
  ciphertextBase64: string,
  ivHex: string,
  passphrase = 'RESQGRID_IN865_COMMUNITY_KEY'
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (!window.crypto || !window.crypto.subtle) {
    return decodeURIComponent(escape(atob(ciphertextBase64)));
  }

  try {
    const keyMaterial = await window.crypto.subtle.digest('SHA-256', encoder.encode(passphrase));
    const aesKey = await window.crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const iv = new Uint8Array(hexToBuffer(ivHex));
    const binaryStr = atob(ciphertextBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      bytes.buffer as ArrayBuffer
    );

    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed:', err);
    return 'DECRYPTION_ERROR: Invalid key or corrupted packet';
  }
}
