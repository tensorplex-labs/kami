import { Transform } from 'class-transformer';
import { utf16ToUtf8String } from '@app/utils';

/**
 * Transforms a hex string (0x-prefixed) to a regular UTF-8 string
 * Use this decorator on DTO properties to automatically convert hex values to human-readable strings
 *
 * @example
 * @Expose()
 * @UtfToString()
 * subnetName: string;
 *
 * @returns Property decorator that transforms hex strings to UTF-8 strings
 */
export function UtfToString() {
  return Transform(({ value }) => utf16ToUtf8String(value));
}
