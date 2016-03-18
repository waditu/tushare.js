import { INDEX_LABELS, INDEX_LIST } from './cons';

function codeToSymbol(code) {
  if (code.length != 6 && _cons.INDEX_LABELS.indexOf(code) >= 0) {
    return _cons.INDEX_LIST[code];
  } else if (code.length === 6) {
    return ['5', '6', '9'].indexOf(code.charAt(0)) >= 0 ? 'sh' + code : 'sz' + code;
  } else{
    return code
  }
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

export function arrayObjectMapping(fields, items) {
  items = items.map(function(ele) {
    let obj = {};
    ele.forEach(function(s, i) {
      let field = fields[i];
      if(field === 'volume') {
        obj[field] = s / 100;
      } else if(field === 'amount') {
        obj[field] = s / 10000;
      } else {
        obj[field] = s;
      }
    });
    return obj;
  });

  return items;
}
