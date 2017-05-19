/* eslint-disable no-console */
import {
  priceUrl,
  tickUrl,
  todayAllUrl,
  liveDataUrl,
  todayTickUrl,
  indexUrl,
  sinaDDUrl,
  klineTTUrl,
  klineTTMinUrl,
} from './urls';

import * as cons from './cons';
import { codeToSymbol, checkStatus, DATE_NOW, randomString } from './util';
import { charset } from '../utils/charset';
import '../utils/fetch';
import { getToday, ttDates } from '../utils/dateu';

const util = require('util');

/**
 * getHistory: 获取个股历史数据
 * 返回数据格式 - 日期 ，开盘价， 最高价， 收盘价， 最低价， 成交量， 价格变动 ，涨跌幅，5日均价，10日均价，20日均价，5日均量，10日均量，20日均量，换手率
 *
 * @param {Object} options = {} - options
 * @param {String} options.code - 股票代码, 例如： '600848'
 * @param {String} options.start - 开始日期 format：YYYY-MM-DD 为空时取到API所提供的最早日期数据
 * @param {String} options.end - 结束日期 format：YYYY-MM-DD 为空时取到最近一个交易日数据
 * @param {String} options.ktype - 数据类型，day=日k线 week=周 month=月 5=5分钟 15=15分钟 30=30分钟 60=60分钟，默认为day
 * @param {String} options.autype - 复权类型，默认前复权, fq=前复权, last=不复权
 * @return {undefined}
 */
export const getHistory = (query = {}) => {
  const defaults = {
    code: null,
    start: null,
    end: null,
    ktype: 'day',
    autype: 'fq',
  };
  const options = Object.assign({}, defaults, query);

  const symbol = codeToSymbol(options.code);
  const url = priceUrl(options.ktype, options.autype, symbol);

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(json => ({ data: json }))
  .catch(error => ({ error }));
};

const _storeListData = (res, listdata, ktype, code, callback = null) => {
  res.buffer().then(buf => {
    let s = buf.toString('ascii');
    const sarr = s.split('=');
    let sdict;
    let l;
    console.log('s %s', s);
    if (sarr.length > 1) {
      s = sarr[1];
      s = s.replace(/,\{"nd.*?\}/, '');
      sdict = JSON.parse(s);
      l = sdict['data'][code][ktype];
      listdata.push(...l);
      if (callback !== null) {
        callback(listdata);
      }
    }
  });
};

const _getTimeTick = ts => {
  const sarr = ts.split('-');
  let retval = 0;
  if (sarr.length >= 3) {
    retval += parseInt(sarr[0], 10) * 100 * 100;
    retval += parseInt(sarr[1], 10) * 100;
    retval += parseInt(sarr[2], 10);
  }
  return retval;
};

const _getTimeTickExpand = ts => {
  const sarr = ts.split('-');
  let retval = 0;
  if (sarr.length >= 3) {
    retval += parseInt(sarr[0], 10) * 100 * 100;
    retval += parseInt(sarr[1], 10) * 100;
    retval += parseInt(sarr[2], 10);
    retval *= 10000;
  }
  return retval;
};

const _getTimeTickShort = ts => {
  let retval = 0;
  retval += parseInt(ts, 10);
  return retval;
};


const _getKDataLong = (options = {}) => {
  let autype = '';
  let kline = '';
  let fq = '';
  let symbol = '';
  const urls = [];
  let url = '';
  let years = [];
  let curfq = '';
  let cursdate;
  let curedate;
  const sdate = options.start;
  let edate = options.end;
  let randomstr;
  let handledurls = [];
  let handleddata = null;

  if (options.cb === undefined || options.cb === null) {
    throw new Error('not define cb in callback');
  }

  if (options.index) {
    if (options.code in cons.INDEX_LIST) {
      symbol = cons.INDEX_LIST[options.code];
    } else {
      symbol = codeToSymbol(options.code);
    }
  } else {
    symbol = codeToSymbol(options.code);
  }

  if (options.autype !== null && options.autype !== '') {
    autype = options.autype;
  }
  if (options.start !== null && options.start !== '') {
    if (options.end === null || options.end === '') {
      edate = getToday();
    }
  }

  if (options.autype !== null && options.autype !== '') {
    autype = options.autype;
  }
  if (options.autype !== '') {
    autype = options.autype;
  }

  if (autype !== '') {
    kline = 'fq';
  }

  if (cons.K_LABELS.includes(options.ktype)) {
    if (autype !== '') {
      fq = autype;
    }
    if ((options.code[0] === '1' ||
        options.code[0] === '5') || options.index) {
      fq = '';
    }


    if ((sdate === null || sdate === '') &&
        (edate === null || edate === '')) {
      randomstr = randomString(17);
      url = klineTTUrl('http://', 'gtimg.cn', kline, fq, symbol, options.ktype, sdate, edate, fq, randomstr);
      urls.push(url);
    } else {
      years = ttDates(sdate, edate);
      years.forEach(elm => {
        cursdate = util.format('%s-01-01', elm);
        curedate = util.format('%s-12-31', elm);
        curfq = util.format('%s%s', fq, elm);

        randomstr = randomString(17);
        url = klineTTUrl('http://', 'gtimg.cn', kline, curfq, symbol, options.ktype, cursdate, curedate, fq, randomstr);
        urls.push(url);
      });
    }
  } else {
    throw new Error(util.format('unknown ktype %s', options.ktype));
  }

  handleddata = [];
  handledurls = [];
  urls.forEach(elmurl => {
    fetch(elmurl)
      .then(checkStatus)
      .then(res => {
        handledurls.push(elmurl);
        if (handledurls.length === urls.length) {
          _storeListData(res, handleddata, options.ktype, symbol, setdata => {
            if (options.cb !== null) {
              const kdata = [];
              const stick = _getTimeTick(sdate);
              const etick = _getTimeTick(edate);

              setdata.forEach(curdata => {
                const curtick = _getTimeTick(curdata[0]);
                if (curtick >= stick && curtick <= etick) {
                  kdata.push(curdata);
                }
              });

              options.cb(kdata, options.args);
            }
          });
        } else {
          _storeListData(res, handleddata, options.ktype, symbol);
        }
      })
      .catch(error => {
        throw new Error(util.format('error for %s %s', elmurl, error));
      });
  });
};

const _getKDataShort = (options = {}) => {
  let symbol = '';
  const urls = [];
  let url = '';
  const sdate = options.start;
  let edate = options.end;
  let randomstr;
  let handledurls = [];
  let handleddata = null;
  let ktype = '';

  if (options.cb === undefined || options.cb === null) {
    throw new Error('not define cb in callback');
  }

  if (options.index) {
    if (cons.INDEX_LIST.includes(options.code)) {
      symbol = cons.INDEX_LIST[options.code];
    } else {
      symbol = codeToSymbol(options.code);
    }
  } else {
    symbol = codeToSymbol(options.code);
  }

  if (options.start !== null && options.start !== '') {
    if (options.end === null || options.end === '') {
      edate = getToday();
    }
  }

  if (cons.K_MIN_LABELS.includes(options.ktype)) {
    randomstr = randomString(16);
    url = klineTTMinUrl('http://', 'gtimg.cn', symbol, options.ktype, randomstr);
    urls.push(url);
  } else {
    throw new Error(util.format('unknown ktype %s', options.ktype));
  }

  handleddata = [];
  handledurls = [];
  ktype = util.format('m%s', options.ktype);
  urls.forEach(elmurl => {
    console.log('elmurl %s', elmurl);
    fetch(elmurl)
      .then(checkStatus)
      .then(res => {
        handledurls.push(elmurl);
        console.log('call length');
        if (handledurls.length === urls.length) {
          _storeListData(res, handleddata, ktype, symbol, setdata => {
            if (options.cb !== null) {
              const kdata = [];
              const stick = _getTimeTickExpand(sdate);
              const etick = _getTimeTickExpand(edate);


              setdata.forEach(curdata => {
                const curtick = _getTimeTickShort(curdata[0]);
                if (curtick >= stick && curtick <= etick) {
                  kdata.push(curdata);
                }
              });

              options.cb(kdata, options.args);
            }
          });
        } else {
          _storeListData(res, handleddata, ktype, symbol);
        }
      })
      .catch(error => {
        throw new Error(util.format('error for %s %s', elmurl, error));
      });
  });
};


/**
 * getKData: 获取k线数据
 * 返回数据格式 - 日期 ，开盘价， 最高价， 收盘价， 最低价， 成交量， 价格变动 ，涨跌幅，5日均价，10日均价，20日均价，5日均量，10日均量，20日均量，换手率
 *
 * @param {Object} options = {} - options
 * @param {String} options.code - 股票代码, 例如： '600848'
 * @param {String} options.start - 开始日期 format：YYYY-MM-DD 为空时取到API所提供的最早日期数据
 * @param {String} options.end - 结束日期 format：YYYY-MM-DD 为空时取到最近一个交易日数据
 * @param {String} options.ktype - 数据类型，day=日k线 week=周 month=月 5=5分钟 15=15分钟 30=30分钟 60=60分钟，默认为day
 * @param {String} options.autype - 复权类型，默认前复权, fq=前复权, last=不复权
 * @param {Bool}   options.index - 是否为指数，默认为false
 * @param {function} options.cb  - 回调函数，得到全部数据之后的处理函数
 * @param {object} options.args  - 回调参数，是回调函数的输入参数
 * @param cb
 * @return {undefined}
 */
export const getKData = (query = {}) => {
  const defaults = {
    code: null,
    start: null,
    end: null,
    ktype: 'day',
    autype: 'fq',
    index: false,
    args: null,
  };

  const options = Object.assign({}, defaults, query);
  if (options.ktype === 'day' ||
      options.ktype === 'week' ||
      options.ktype === 'month') {
    return _getKDataLong(options);
  }

  if (options.ktype === '30' ||
      options.ktype === '5' ||
      options.ktype === '1' ||
      options.ktype === '60') {
    return _getKDataShort(options);
  }

  throw new Error(util.format('not supported ktype %s', options.ktype));
};


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
export const getTick = (query = {}) => {
  const defaults = {
    code: null,
    date: null,
  };
  const options = Object.assign({}, defaults, query);

  const symbol = codeToSymbol(options.code);
  const url = tickUrl(options.date, symbol);
  const mapData = data => {
    const result = [];
    data.split('\n').forEach((line, i) => {
      if (i !== 0 && line !== '') {
        result.push(line.split('\t'));
      }
    });
    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(charset('GBK'))
  .then(mapData)
  .catch(error => ({ error }));
};

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
/* eslint-disable no-eval */
export const getTodayAll = (query = {}) => {
  const defaults = {
    pageSize: 10000,
    pageNo: 1,
  };
  const options = Object.assign({}, defaults, query);
  const url = todayAllUrl(options.pageSize, options.pageNo);

  return fetch(url)
  .then(checkStatus)
  .then(res => res.text())
  .then(data => ({ data: eval(data) }))
  .catch(error => ({ error }));
};

/**
 * getLiveData - 获取实时交易数据
 * 返回数据：{Array}
 * 0：股票代码
 * 1：股票名字
 * 2：今日开盘价
 * 3：昨日收盘价
 * 4：当前价格
 * 5：今日最高价
 * 6：今日最低价
 * 7：竞买价，即“买一”报价
 * 8：竞卖价，即“卖一”报价
 * 9：成交量 maybe you need do volume/100
 * 10：成交金额（元 CNY）
 * 11：委买一（笔数 bid volume）
 * 12：委买一（价格 bid price）
 * 13：“买二”
 * 14：“买二”
 * 15：“买三”
 * 16：“买三”
 * 17：“买四”
 * 18：“买四”
 * 19：“买五”
 * 20：“买五”
 * 21：委卖一（笔数 ask volume）
 * 22：委卖一（价格 ask price）
 * ...
 * 31：日期；
 * 32：时间；
 *
 * @param {Object} options
 * @param {Array} options.codes - 股票代码数组，例如['600848', '600000', '600343']
 * @param cb
 * @return {undefined}
 */
export const getLiveData = (query = {}) => {
  const defaults = { codes: ['600000'] };
  const options = Object.assign({}, defaults, query);
  const codes = options.codes.map(code => codeToSymbol(code));
  const url = liveDataUrl(codes);
  const mapData = data => {
    const result = data.split('\n')
    .filter(item => item !== '')
    .map(item => {
      const matches = item.match(/(sz|sh)(\d{6}).*"(.*)"/i);
      const symbol = matches[1] + matches[2];
      const records = matches[3].split(',');
      return [symbol, ...records];
    });

    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(charset('GBK'))
  .then(mapData)
  .catch(error => ({ error }));
};

/**
 * getTodayTick - 获取当日分笔明细数据，用于在交易进行的时候获取
 * 返回数据：
 * {
 *  begin: 开始时间,
 *  end: 结束时间,
 *  zhubi_list: [
 *    {
 *      TRADE_TYPE: 交易类型, 1: 买盘，0：中性盘，-1：卖盘
 *      PRICE_PRE: 上一档价格
 *      PRICE: 当前价格
 *      VOLUME_INC: 成交量(股)
 *      TURNOVER_INC: 成交额
 *      TRADE_TYPE_STR: 交易类型：买盘、卖盘、中性盘
 *      DATE_STR: 时间
 *    }
 *  ]
 * }
 *
 * @param {Object} options
 * @param {String} options.code - 六位股票代码
 * @param {String} options.end - 结束时间。例如：15:00:00, 那么就会获取14:55:00 - 15:00:00之间的分笔数据，也就是end指定时间之前的五分钟
 * @param cb
 * @return {undefined}
 */
export const getTodayTick = (query = {}) => {
  const defaults = {
    code: '600000',
    end: '15:00:00',
  };
  const options = Object.assign({}, defaults, query);
  const url = todayTickUrl(options.code, options.end);

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(json => ({ data: json }))
  .catch(error => ({ error }));
};

export const getIndex = () => {
  const url = indexUrl();
  const mapData = data => {
    const result = data.split('\n')
      .filter(item => item !== '')
      .map(item => {
        const matches = item.match(/(sz|sh)(\d{6}).*"(.*)"/i);
        const symbol = matches[1] + matches[2];
        const records = matches[3].split(',');
        return {
          code: symbol,
          name: records[0],
          open: records[1],
          preclose: records[2],
          close: records[3],
          high: records[4],
          low: records[5],
          volume: records[8],
          amount: records[9],
        };
      });
    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(charset('GBK'))
  .then(mapData)
  .catch(error => ({ error }));
};

/**
 * getSinaDD - 获取新浪大单数据
 * 返回数组：
 * [
 *  {
 *    symbol: 股票代码
 *    name: 股票名字
 *    time: 时间
 *    price: 成交价格
 *    volume: 成交量（手）
 *    preprice: 前一价格
 *    type: 类型，买盘、卖盘、中性盘
 *  }
 * ]
 *
 * @param {Object} options
 * @param {String} options.code - 六位股票代码
 * @param {String} options.volume - 设置多少手以上算大单，例如: 400，则返回400手以上交易量的大单
 * @param {String} options.date - 日期，格式YYYY-MM-DD， 默认当日日期
 * @param cb
 * @return {undefined}
 */
export const getSinaDD = (query = {}) => {
  const defaults = {
    code: '600000',
    volume: 400,
    date: DATE_NOW,
  };
  const options = Object.assign({}, defaults, query);
  const url = sinaDDUrl(codeToSymbol(options.code), options.volume * 100, options.date);
  const mapData = data => {
    const result = data.split('\n')
      .filter((item, idx) => item !== '' && idx !== 0)
      .map(item => {
        const ddArr = item.split(',');
        return {
          symbol: ddArr[0],
          name: ddArr[1],
          time: ddArr[2],
          price: ddArr[3],
          volume: ddArr[4] / 100,
          preprice: ddArr[5],
          type: ddArr[6],
        };
      });
    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(charset('GBK'))
  .then(mapData)
  .catch(error => ({ error }));
};
