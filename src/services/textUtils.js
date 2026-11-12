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

/**
 * Replaces all occurrences of newlines with a single space.
 * @param {string} str
 * @returns {string}
 */
export function replaceNewlines(str) {
  if (!str) return '';
  return str.replace(/\r?\n/g, ' ');
}
