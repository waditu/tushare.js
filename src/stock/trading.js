import request from 'superagent-charset';
import { priceUrl, tickUrl, todayAllUrl } from './urls';
import { codeToSymbol } from './util';

/**
 * getHistory: 获取个股历史数据
 * 返回数据格式 - 日期 ，开盘价， 最高价， 收盘价， 最低价， 成交量， 价格变动 ，涨跌幅，5日均价，10日均价，20日均价，5日均量，10日均量，20日均量，换手率
 *
 * @param {Object} options = {} - options
 * @param {String} options.code - 股票代码, 例如： '600848'
 * @param {String} options.start - 开始日期 format：YYYY-MM-DD 为空时取到API所提供的最早日期数据
 * @param {String} options.end - 结束日期 format：YYYY-MM-DD 为空时取到最近一个交易日数据
 * @param {String} options.ktype - 数据类型，day=日k线 week=周 month=月 5=5分钟 15=15分钟 30=30分钟 60=60分钟，默认为day
 * @param cb
 * @return {undefined}
 */
export function getHistory(options = {}, cb) {
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

/**
 * getTick - 获取历史分笔数据
 * 返回格式：成交时间 成交价  涨跌幅  价格变动  成交量(手)  成交额(元)  性质
 *
 * @param {Object} options
 * @param {string} options.code - 股票代码, 例如： '600848'
 * @param {string} options.date - 日期 格式：YYYY-MM-DD
 * @param cb
 * @return {undefined}
 */
export function getTick(options, cb) {
  const defaults = {
    code: null,
    date: null
  };
  if(Object.prototype.toString.apply(options) === '[object Function]') {
    cb = options;
    options = {};
  }
  options = Object.assign(defaults, options);

  const symbol = codeToSymbol(options.code);
  const url = tickUrl(options.date, symbol);

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let ret = [];
        res.text.split('\n').forEach(function(line, i) {
          if(i !== 0 && line !== '') {
            ret.push(line.split('\t'));
          }
        });
        cb(null, ret);
      } else {
        cb(null, []);
      }
    });
}

/**
 * getTodayAll - 一次性获取最近一个日交易日所有股票的交易数据
 * 返回数据格式：代码，名称，涨跌幅，现价，开盘价，最高价，最低价，最日收盘价，成交量，换手率
 *
 * @param options - (可选) 若为空，则返回A股市场今日所有数据
 * @param {Number} options.pageSize - 分页的大小，如：80， 默认10000，即返回所有数据
 * @param {Number} options.pageNo - 分页页码，默认1
 * @param cb
 * @return {undefined}
 */
export function getTodayAll(options, cb) {
  const defaults = {
    pageSize: 10000,
    pageNo: 1
  };
  if(Object.prototype.toString.apply(options) === '[object Function]') {
    cb = options;
    options = {};
  }
  options = Object.assign(defaults, options);

  const url = todayAllUrl(options.pageSize, options.pageNo);

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let ret = eval(res.text);
        cb(null, ret);
      } else {
        cb(null, []);
      }
    });
}
