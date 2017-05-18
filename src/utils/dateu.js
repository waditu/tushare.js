const strftime = require('strftime');

export function getToday() {
  const d = new Date();
  return strftime('%Y-%m-%d', d);
}


export function ttDates(sdate, edate) {
  const retyears = [];
  let iyear;
  let sarr = sdate.split('-');
  const syear = parseInt(sarr[0], 10);
  sarr = edate.split('-');
  const eyear = parseInt(sarr[0], 10);
  iyear = syear;
  while (iyear < eyear) {
    retyears.push(iyear);
    iyear += 1;
  }
  if (eyear !== syear) {
    retyears.push(eyear);
  }
  return retyears;
}
