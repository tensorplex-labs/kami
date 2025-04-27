import { utf16ToUtf8String } from '@app/utils';
import { Transform } from 'class-transformer';

/**
 * Transforms an array of UTF-16 code units to a UTF-8 string
 * Use this decorator on DTO properties that receive encoded text data
 *
 * @example
 * @Expose()
 * @UtfToString()
 * symbol: number[]; // [65, 66, 67] will be transformed to "ABC"
 *
 * @returns Property decorator that converts UTF-16 code unit arrays to readable UTF-8 strings
 */
export function UtfToString() {
  return Transform(({ value }) => utf16ToUtf8String(value));
}
