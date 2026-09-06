const LOCATION_TIMEZONES: Record<string, string> = {
  Nepal: "Asia/Kathmandu",
  Japan: "Asia/Tokyo",
  USA: "America/New_York",
};

const DEFAULT_TIMEZONE = "Asia/Tokyo";

export function getTimezoneForLocation(location?: string) {
  if (!location) return DEFAULT_TIMEZONE;
  return LOCATION_TIMEZONES[location] ?? DEFAULT_TIMEZONE;
}