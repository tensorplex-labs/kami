import { Address4, Address6 } from "ip-address";


export function intToIp(
    ip: number | string,
    type: number,
  ): string {
    try {
      if (type === 4) {
        const ipVal = Address4.fromBigInt(BigInt(ip));
        return ipVal.correctForm();
      } else if (type === 6) {
        if (typeof ip != 'string') {
          throw new Error('Invalid IP type');
        }
        const ipVal = new Address6(ip);
        return ipVal.correctForm();
      } else if (type === 0) {
        return "";
      } else {
        throw new Error('Invalid IP type');
      }
    } catch (error) {
      throw error;
    }
  }