import { INDEX_LABELS, INDEX_LIST } from './cons';

export function codeToSymbol(code) {
  let symbol = '';
  if(INDEX_LABELS.indexOf(code) >= 0) {
    symbol = INDEX_LIST[code];
  } else if(code.length === 6) {
    symbol = ['5', '6', '9'].indexOf(code.charAt(0) >= 0) ? 'sh' + code : 'sz' + code;
  }

  return symbol;
}

export function csvToObject(csv) {
  let csvArr = csv.trim().split('\r\n');
  let headers = csvArr.splice(0, 1);

  headers = headers[0].split(',');
  csvArr = csvArr.map(function(ele) {
    let obj = {};
    ele.split(',').forEach(function(s, i) {
      obj[headers[i]] = s;
    });
    return obj;
  });

  return csvArr;
}
