const strftime = require('strftime');

export function getToday() {
  const d = new Date();
  return strftime('%Y-%m-%d', d);
}
