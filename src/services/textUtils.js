/**
 * Truncates a string to stay within the maximum weighted length.
 * @param {string} str
 * @param {number} maxWeight
 * @returns {string}
 */
export function truncateToWeightedLength(str, maxWeight) {
  if (typeof str !== 'string' || !str) return '';
  // A non-numeric limit can never be honoured; read it as 0 rather than
  // letting coercion (e.g. "3" + epsilon -> 30.0001) leak text past it.
  const limit = typeof maxWeight === 'number' && !Number.isNaN(maxWeight) ? maxWeight : 0;
  let currentWeight = 0;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const charCode = char.charCodeAt(0);
    const unitWeight = ((charCode >= 0x0000 && charCode <= 0x007F) || (charCode >= 0xFF61 && charCode <= 0xFF9F)) ? 1 : 1.65;
    // Never split a surrogate pair: an astral character is taken whole or
    // not at all. Emitting half of it leaves a lone surrogate, which makes
    // encodeURIComponent throw URIError when the text is sent to the API.
    const isPair = charCode >= 0xD800 && charCode <= 0xDBFF &&
      i + 1 < str.length && str.charCodeAt(i + 1) >= 0xDC00 && str.charCodeAt(i + 1) <= 0xDFFF;
    const weight = isPair ? unitWeight * 2 : unitWeight;

    if (currentWeight + weight <= limit + 0.0001) { // Add small epsilon for floating point comparison
      result += isPair ? char + str[i + 1] : char;
      currentWeight += weight;
      if (isPair) i++;
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
  if (typeof str !== 'string' || !str) return '';
  return str.replace(/\r?\n/g, ' ');
}
