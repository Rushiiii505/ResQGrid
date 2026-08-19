// ResQGrid Geolocation & Dead-Reckoning Compass Engine
// Queries real browser navigator.geolocation and device orientation IMU sensors

export interface GeoLocationState {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  isRealGps: boolean;
  timestamp: number;
  locationName?: string;
}

// Default fallback location: Khardung La Pass, Ladakh, India
export const DEFAULT_FALLBACK_LOCATION: GeoLocationState = {
  lat: 34.2787,
  lng: 77.6047,
  accuracy: 12,
  altitude: 5359, // 17,582 ft
  speed: 0,
  heading: 45,
  isRealGps: false,
  timestamp: Date.now(),
  locationName: 'Khardung La Pass, Ladakh (17,582 ft)',
};

// Calculate distance between two GPS coordinates in kilometers (Haversine formula)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Request real user location from browser
export async function getRealDeviceLocation(): Promise<GeoLocationState> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: Math.round(position.coords.latitude * 10000) / 10000,
          lng: Math.round(position.coords.longitude * 10000) / 10000,
          accuracy: Math.round(position.coords.accuracy),
          altitude: position.coords.altitude ? Math.round(position.coords.altitude) : null,
          speed: position.coords.speed ? Math.round(position.coords.speed * 3.6) : null,
          heading: position.coords.heading,
          isRealGps: true,
          timestamp: position.timestamp,
          locationName: 'Active GPS Satellite Fix',
        });
      },
      (err) => {
        console.warn('Geolocation access failed or denied, using fallback coordinates:', err.message);
        resolve(DEFAULT_FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      }
    );
  });
}

// Listen to real hardware compass / gyroscope orientation
export function watchDeviceCompass(onHeadingChange: (heading: number) => void): () => void {
  const handler = (event: DeviceOrientationEvent) => {
    let heading = 0;
    // iOS Safari webkitCompassHeading
    if ('webkitCompassHeading' in event && typeof (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
      heading = (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android / standard compass
      heading = 360 - event.alpha;
    }
    if (heading !== undefined && !isNaN(heading)) {
      onHeadingChange(Math.round(heading));
    }
  };

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('deviceorientation', handler, true);
  }

  return () => {
    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('deviceorientation', handler, true);
    }
  };
}
