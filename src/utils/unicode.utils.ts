/**
 * Converts an array of Unicode decimal code points to a string
 * @param codePoints Array of decimal Unicode code points
 * @returns The decoded string
 */
export function unicodeCodePointsToString(codePoints: number[]): string {
  return codePoints.map(cp => String.fromCodePoint(cp)).join('');
}
