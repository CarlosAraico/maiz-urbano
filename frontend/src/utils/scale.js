export const scaleAmount = (quantity, baseServings, target) => {
  if (!baseServings || baseServings <= 0) throw new Error('baseServings must be > 0');
  return Math.round((quantity / baseServings) * target);
};
