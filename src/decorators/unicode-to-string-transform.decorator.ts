import { Transform } from 'class-transformer';
import { unicodeCodePointsToString } from '@app/utils';

/**
 * Transforms an array of Unicode code points to a readable string
 * Use this decorator on DTO properties that contain Unicode code point arrays
 *
 * @example
 * @Expose()
 * @UnicodeToString()
 * name: number[]; // [72, 101, 108, 108, 111] will be transformed to "Hello"
 *
 * @returns Property decorator that converts Unicode code point arrays to human-readable strings
 */
export function UnicodeToString() {
  return Transform(({ value }) => unicodeCodePointsToString(value));
}
