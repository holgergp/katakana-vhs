/**
 * Fisher-Yates shuffle to randomize an array.
 * Returns a new array.
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates wrong options (distractors) from a pool, excluding the correct option.
 *
 * @param {any} correct - The correct option/value to exclude.
 * @param {Array} pool - The array of all possible options (values, e.g. strings or items).
 * @param {number} count - The number of incorrect options to return (default 2).
 * @returns {Array} - Array of wrong options.
 */
export function getWrongOptions(correct, pool, count = 2) {
  const otherOptions = pool.filter((item) => item !== correct);
  const shuffled = shuffle(otherOptions);
  return shuffled.slice(0, count);
}

/**
 * Performs weighted random selection on a pool of items.
 * Items with higher wrong count in wrongCounts will have higher selection probability.
 *
 * @param {Array} pool - The list of items to choose from.
 * @param {Object} wrongCounts - A map/object of itemKey -> count of wrong answers.
 * @param {Function} getKey - Function to extract the unique key for tracking from an item.
 * @returns {any} - The selected item.
 */
export function pickWeighted(
  pool,
  wrongCounts = {},
  getKey = (item) => item.char,
) {
  if (!pool || pool.length === 0) return null;

  // Calculate weights: base weight of 1, plus 2 for every wrong answer.
  const weights = pool.map((item) => {
    const key = getKey(item);
    const count = wrongCounts[key] || 0;
    return 1 + count * 2;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < pool.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return pool[i];
    }
  }

  return pool[pool.length - 1];
}
