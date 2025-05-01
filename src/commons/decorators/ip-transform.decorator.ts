import { intToIp } from '@app/commons/utils';
import { Transform } from 'class-transformer';

/**
 * Transforms a numeric IP representation to a human-readable IP address string
 * Uses the ipType value to determine whether to format as IPv4 or IPv6
 *
 * @example
 * @Expose()
 * @IpToString()
 * ip: number; // Will be transformed to a string like "192.168.1.1" or IPv6 equivalent
 *
 * @returns Property decorator that converts numeric IP values to formatted address strings
 */
export function IpToString() {
  return Transform(({ value, obj }) => intToIp(value, obj.ipType));
}
