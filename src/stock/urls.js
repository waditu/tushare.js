import { K_TYPE } from './cons';

export function priceUrl(ktype, symbol) {
  const _ktype = K_TYPE[ktype] ? K_TYPE[ktype] : K_TYPE.minute;
  const type = _ktype === K_TYPE.minute ? ktype : 'last';
  return `http://api.finance.ifeng.com/${_ktype}/?code=${symbol}&type=${type}`;
}

export function tickUrl(date, symbol) {
  const url = `http://market.finance.sina.com.cn/downxls.php?date=${date}&symbol=${symbol}`;
  return url;
}
