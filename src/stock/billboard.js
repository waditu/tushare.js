import request from 'superagent-charset';
import moment from 'moment';
import {
  lhbUrl
} from './urls';
import { codeToSymbol } from './util';

export function lhb(options, cb) {
  const defaults = {
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  };
  if(Object.prototype.toString.apply(options) === '[object Function]') {
    cb = options;
    options = {};
  }
  options = Object.assign(defaults, options);
  const url = lhbUrl(options.start, options.end);

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let result = {};
        let data = JSON.parse(res.text);
        result.page = data.page + 1;
        result.total = data.total;
        result.pageCount = data.pagecount;
        result.items = data.list.map((item) => {
          return {
            symbol: codeToSymbol(item.SYMBOL),
            name: item.SNAME,
            price: item.TCLOSE,
            date: item.TDATE,
            changePercent: item.PCHG,
            type: item.SMEBTSTOCK1,
            volume: item.VOTURNOVER * 100,
            amount: item.VATURNOVER * 100
          };
        });

        cb(null, result);
      } else {
        cb(null, {});
      }
    });
}
