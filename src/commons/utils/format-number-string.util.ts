/**
 * Utility functions for formatting and converting numbers
 */

/**
 * Converts a value to a number format, handling different input types
 * @param value Value to convert to a number (string, hex, bigint, etc.)
 * @returns The converted number value
 */
export function formatNumberString(value: any): number {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return 0;
  }

  // Handle string formats
  if (typeof value === 'string') {
    // Handle hexadecimal strings
    if (value.startsWith('0x')) {
      return Number(BigInt(value));
    }
    return Number(value);
  }

  // Handle other types (numbers, bigint, etc.)
  return Number(value);
}
