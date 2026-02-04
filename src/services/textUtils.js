/**
 * Calculates the weighted length of a string.
 * Half-width characters (ASCII and half-width Katakana) are weighted as 1.0.
 * Full-width characters are weighted as 1.65.
 * @param {string} str
 * @returns {number}
 */
export function getWeightedLength(str) {
  if (!str) return 0;
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // ASCII: 0x0000 to 0x007F
    // Half-width Katakana: 0xFF61 to 0xFF9F
    if ((charCode >= 0x0000 && charCode <= 0x007F) || (charCode >= 0xFF61 && charCode <= 0xFF9F)) {
      length += 1;
    } else {
      length += 1.65;
    }
  }
  return length;
}

/**
 * Truncates a string to stay within the maximum weighted length.
 * @param {string} str
 * @param {number} maxWeight
 * @returns {string}
 */
export function truncateToWeightedLength(str, maxWeight) {
  if (!str) return '';
  let currentWeight = 0;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const charCode = char.charCodeAt(0);
    const weight = ((charCode >= 0x0000 && charCode <= 0x007F) || (charCode >= 0xFF61 && charCode <= 0xFF9F)) ? 1 : 1.65;

    if (currentWeight + weight <= maxWeight + 0.0001) { // Add small epsilon for floating point comparison
      result += char;
      currentWeight += weight;
    } else {
      break;
    }
  }
  return result;
}
