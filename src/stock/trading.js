import request from 'superagent';
import { priceUrl } from './urls';
import { codeToSymbol } from './util';

/**
 * getHistData
 *
 * @param {Object} options = {} - options
 * @param {String} options.code - 股票代码, 例如： '600848'
 * @param {String} options.start - 开始日期 format：YYYY-MM-DD 为空时取到API所提供的最早日期数据
 * @param {String} options.end - 结束日期 format：YYYY-MM-DD 为空时取到最近一个交易日数据
 * @param {String} options.ktype - 数据类型，day=日k线 week=周 month=月 5=5分钟 15=15分钟 30=30分钟 60=60分钟，默认为day
 * @param cb
 * @return {undefined}
 */
export function getHistData(options = {}, cb) {
  const defaults = {
    code: null,
    start: null,
    end: null,
    ktype: 'day'
  };
  if(Object.prototype.toString.apply(options) === '[object Function]') {
    cb = options;
    options = {};
  }
  options = Object.assign(defaults, options);

  const symbol = codeToSymbol(options.code);
  const url = priceUrl(options.ktype, symbol);

  request
    .get(url)
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        cb(null, JSON.parse(res.text));
      } else {
        cb(null, {});
      }
    });
}
