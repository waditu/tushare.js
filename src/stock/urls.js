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

export function todayAllUrl(pageSize, pageNo) {
  const url = `http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?num=${pageSize}&sort=changepercent&asc=0&node=hs_a&symbol=&_s_r_a=page&page=${pageNo}`
  return url;
}

export function liveDataUrl(symbols) {
  const url = `http://hq.sinajs.cn/list=${symbols.join(',')}`;
  return url;
}

export function todayTickUrl(code, end = '15:00:00') {
  const url = `http://quotes.money.163.com/service/zhubi_ajax.html?symbol=${code}&end=${end}`;
  return url;
}
