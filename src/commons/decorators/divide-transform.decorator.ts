import { formatNumberString } from '@app/commons/utils';
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
      return value.map(item => {
        if (item === null || item === undefined) {
          return item;
        }
        return formatNumberString(item) / divisor;
      });
    }

    // Handle single values
    return formatNumberString(value) / divisor;
  });
}
