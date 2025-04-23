/**
 * Utility functions for handling hex string conversions
 */

/**
 * Converts a hexadecimal string to a human-readable UTF-8 string
 * @param hexString - Hex string in the format "0x..."
 * @returns Decoded UTF-8 string or empty string if invalid
 */
export function hexToString(
  hexString: `0x${string}` | string | null | undefined,
): string {
  if (!hexString) return '';

  // Validate the hex string format
  if (!hexString.startsWith('0x')) {
    return hexString; // Return as is if not a hex string
  }

  try {
    // Remove '0x' prefix and decode
    const hexWithoutPrefix = hexString.slice(2);
    // Handle empty hex strings
    if (hexWithoutPrefix.length === 0) return '';

    // Convert hex to buffer and then to UTF-8 string
    const bytes = Buffer.from(hexWithoutPrefix, 'hex');
    // Filter out non-printable characters and null bytes
    const filtered = Buffer.from(
      bytes.filter((byte) => byte >= 32 && byte <= 126),
    );

    return filtered.toString('utf8');
  } catch (error) {
    console.error('Error decoding hex string:', error);
    return '';
  }
}

/**
 * Converts a string to a hexadecimal representation
 * @param str - UTF-8 string to convert
 * @returns Hex string in "0x..." format
 */
export function stringToHex(str: string): `0x${string}` {
  if (!str) return '0x';

  const buf = Buffer.from(str, 'utf8');
  return `0x${buf.toString('hex')}`;
}

/**
 * Validates if a string is a valid hex string with 0x prefix
 * @param value - String to check
 * @returns True if the string is a valid hex string
 */
export function isValidHexString(value: string): boolean {
  return /^0x[0-9a-fA-F]*$/.test(value);
}
