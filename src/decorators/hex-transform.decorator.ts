import { Transform } from 'class-transformer';
import { hexToString } from '@app/utils';

/**
 * Transforms a hex string (0x-prefixed) to a regular UTF-8 string
 * Use this decorator on DTO properties to automatically convert hex values to human-readable strings
 * 
 * @example
 * @Expose()
 * @HexToString()
 * subnetName: string;
 * 
 * @returns Property decorator that transforms hex strings to UTF-8 strings
 */
export function HexToString() {
  return Transform(({ value }) => hexToString(value));
}