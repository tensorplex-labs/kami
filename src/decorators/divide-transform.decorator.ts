import { Transform } from 'class-transformer';

/**
 * Creates a decorator that divides a number by the specified divisor
 * Works with both individual values and arrays of values
 * @param divisor The number to divide by
 * @returns A transform decorator
 */
export function DivideBy(divisor: number) {
  return Transform(({ value }) => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (item === null || item === undefined) {
          return item;
        }
        return processValue(item, divisor);
      });
    }

    // Handle single values
    return processValue(value, divisor);
  });
}

/**
 * Processes a single value, converting it to a number and dividing by the divisor
 */
function processValue(value: any, divisor: number): number {
  let numValue: number;

  // Handle different input formats (string, hex, bigint, etc.)
  if (typeof value === 'string') {
    // Handle hexadecimal strings
    if (value.startsWith('0x')) {
      numValue = Number(BigInt(value));
    } else {
      numValue = Number(value);
    }
  } else {
    numValue = Number(value);
  }

  // Perform the division
  return numValue / divisor;
}
