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
