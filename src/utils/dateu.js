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
  } else if (syear === eyear) {
    retyears.push(syear);
  }
  return retyears;
}
