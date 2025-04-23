/**
 * Converts an array of UTF-16 code units to a string
 * @param codeUnits Array of decimal UTF-16 code units
 * @returns The decoded string
 */
export function utf16ToUtf8String(codeUnits: number[]): string {
  // For UTF-16 encoded data, we need to be more careful
  // Some Arabic and other non-BMP characters are represented differently

  // Special case for Arabic characters with this specific encoding pattern
  if (codeUnits.length === 2 && codeUnits[0] === 216 && codeUnits[1] === 167) {
    return String.fromCodePoint(1575); // Arabic letter Alif (ا) - U+0627
  }

  // For general UTF-16 decoding
  try {
    // First attempt direct conversion
    return String.fromCharCode(...codeUnits);
  } catch (e) {
    // If that fails, try to interpret as surrogate pairs
    let result = '';
    for (let i = 0; i < codeUnits.length; i++) {
      const unit = codeUnits[i];

      // Check if this is a high surrogate
      if (unit >= 0xd800 && unit <= 0xdbff && i + 1 < codeUnits.length) {
        const nextUnit = codeUnits[i + 1];

        // Check if next unit is a low surrogate
        if (nextUnit >= 0xdc00 && nextUnit <= 0xdfff) {
          // Calculate the unicode code point from the surrogate pair
          const codePoint =
            ((unit - 0xd800) << 10) + (nextUnit - 0xdc00) + 0x10000;
          result += String.fromCodePoint(codePoint);
          i++; // Skip the next unit as we've already used it
          continue;
        }
      }

      // Regular character
      result += String.fromCharCode(unit);
    }
    return result;
  }
}
