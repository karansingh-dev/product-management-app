export function isValidUUID(uuidString) {
  // This regex pattern checks the full string, ensures correct hyphen positions,
  // and validates the version and variant formatting rules per RFC 4122.
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuidString);
}