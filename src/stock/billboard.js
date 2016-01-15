import request from 'superagent-charset';
import moment from 'moment';
import {
  lhbUrl,
  blockTradeUrl
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

/**
 * blockTrade - 大宗交易
 * 返回数据格式:
 * [
 *  {
 *    symbol: 股票代码
 *    name: 股票名称
 *    dealPrice: 成交价
 *    price: 收盘价
 *    date: 日期
 *    volumn: 成交量（手）
 *    amout: 成交额（万）
 *    buyer: 买方
 *    seller: 卖方
 *    dopRate: 折溢价率
 *  }
 * ]
 *
 * @param options
 * @param cb
 * @returns {undefined}
 */
export function blockTrade(options, cb) {
  const defaults = {
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    pageNo: 1,
    pageSize: 150
  };
  if(Object.prototype.toString.apply(options) === '[object Function]') {
    cb = options;
    options = {};
  }
  options = Object.assign(defaults, options);
  const url = blockTradeUrl(options.start, options.end, options.pageNo, options.pageSize);

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
            dealPrice: item.DZJY5,
            price: item.TCLOSE,
            date: item.PUBLISHDATE,
            volume: item.DZJY2 * 100,
            amount: item.DZJY6,
            buyer: item.DZJY9,
            seller: item.DZJY11,
            dopRate: item.DZJY55
          };
        });

        cb(null, result);
      } else {
        cb(null, {});
      }
    });
}
