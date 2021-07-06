export const POINTS = ["0", "15", "30", "40", "adv", "win"];

/**
 * Transform machine score to game score
 * @param {number} value
 * @return {string}
 */
export function getScore(value: number) {
  return POINTS[value];
}
