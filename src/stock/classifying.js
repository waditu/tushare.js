import request from 'superagent-charset';
import {
  sinaIndustryIndexUrl,
  sinaClassifyDetailUrl
} from './urls';
import { codeToSymbol } from './util';

/**
 * getSinaIndustryClassified: 获取新浪行业板块数据
 * 返回数据格式 - 数组，包含：
 * tag: 新浪行业分类标识
 * name: 新浪行业分类名称
 * num: 行业包含股票数量
 * price: 平均价
 * changePrice: 涨跌额
 * changePercent: 涨跌幅
 * volume: 总成交量（手）
 * amount: 总成交额（万）
 * leadingSymbol: 领涨股票代码
 * leadingChangePercent: 领涨股涨跌幅
 * leadingPrice: 领涨股价格
 * leadingChangePrice: 领涨股涨跌额
 * leadingName: 领涨股名称
 */
export function getSinaIndustryClassified(cb) {
  const url = sinaIndustryIndexUrl();

  request
    .get(url)
    .charset('gbk')
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let ret = [];
        const json = JSON.parse(res.text.split('=')[1].trim());
        for(let tag in json) {
          const industryArr = json[tag].split(',');
          ret.push({
            tag: industryArr[0],
            name: industryArr[1],
            num: industryArr[2],
            price: industryArr[3],
            changePrice: industryArr[4],
            changePercent: industryArr[5],
            volume: industryArr[6] / 100,
            amount: industryArr[7] / 10000,
            leadingSymbol: industryArr[8],
            leadingChangePercent: industryArr[9],
            leadingPrice: industryArr[10],
            leadingChangePrice: industryArr[11],
            leadingName: industryArr[12]
          });
        }

        cb(null, ret);
      } else {
        cb(null, []);
      }
    });
}

/**
 * getClassifyDetails - 获取新浪某个行业分类下的股票数据
 * 返回数组:
 * [
 *  {
 *    symbol: 股票代码
 *    name: 股票名称
 *    price: 当前价格
 *    changePrice: 涨跌额
 *    changePercent: 涨跌幅
 *    open: 开盘价
 *    high: 最高价
 *    low: 最低价
 *    volume: 成交量（手）
 *    amount: 成交额（万）
 *    tickTime: 数据时间
 *  }
 * ]
 *
 * @param {Object} options
 * @param {string} options.tag - 新浪行业代码，从getSinaIndustryClassified返回，例如new_jrhy: 金融行业
 * @param cb
 * @return {undefined}
 */
export function getSinaClassifyDetails(options, cb) {
  const defaults = {
    tag: 'new_jrhy' // 默认金融行业
  };
  if(Object.prototype.toString.apply(options) === '[object Function]') {
    cb = options;
    options = {};
  }
  options = Object.assign(defaults, options);
  const url = sinaClassifyDetailUrl(options.tag);

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let ret = eval(res.text);
        if(ret) {
          ret = ret.map(function(ele) {
            return {
              symbol: ele.symbol,
              name: ele.name,
              price: ele.trade,
              changePrice: ele.pricechange,
              changePercent: ele.changepercent,
              open: ele.open,
              high: ele.high,
              low: ele.low,
              volume: ele.volume / 100,
              amount: ele.amount / 10000,
              tickTime: ele.ticktime
            };
          });
        }
        cb(null, ret);
      } else {
        cb(null, []);
      }
    });
}
