import request from 'superagent-charset';
import {
  sinaIndustryIndexUrl,
  sinaClassifyDetailUrl,
  sinaConceptsIndexUrl,
  allStockUrl,
  hs300Url
} from './urls';
import { codeToSymbol, csvToObject } from './util';

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

/**
 * getSinaConceptsClassified - 获取新浪概念板块分类数据
 * 返回数据格式 - 数组，包含：
 * tag: 新浪概念分类标识
 * name: 新浪概念分类名称
 * num: 概念包含股票数量
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
 *
 * @param cb
 * @returns {undefined}
 */
export function getSinaConceptsClassified(cb) {
  const url = sinaConceptsIndexUrl();

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let ret = [];
        const json = JSON.parse(res.text.split('=')[1].trim());
        for(let tag in json) {
          const conceptsArr = json[tag].split(',');
          ret.push({
            tag: conceptsArr[0],
            name: conceptsArr[1],
            num: conceptsArr[2],
            price: conceptsArr[3],
            changePrice: conceptsArr[4],
            changePercent: conceptsArr[5],
            volume: conceptsArr[6] / 100,
            amount: conceptsArr[7] / 10000,
            leadingSymbol: conceptsArr[8],
            leadingChangePercent: conceptsArr[9],
            leadingPrice: conceptsArr[10],
            leadingChangePrice: conceptsArr[11],
            leadingName: conceptsArr[12]
          });
        }

        cb(null, ret);
      } else {
        cb(null, []);
      }
    });
}

/**
 * getAllStocks - 返回沪深上市公司基本情况
 * 返回数据格式:
 * [
 *  {
 *    code,代码
 *    name,名称
 *    industry,所属行业
 *    area,地区
 *    pe,市盈率
 *    outstanding,流通股本
 *    totals,总股本(万)
 *    totalAssets,总资产(万)
 *    liquidAssets,流动资产
 *    fixedAssets,固定资产
 *    reserved,公积金
 *    reservedPerShare,每股公积金
 *    eps,每股收益
 *    bvps,每股净资
 *    pb,市净率
 *    timeToMarket,上市日期
 *  }
 * ]
 *
 * @param cb
 * @returns {undefined}
 */
export function getAllStocks(cb) {
  const url = allStockUrl();

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        const stockList = csvToObject(res.text);
        cb(null, stockList);
      } else {
        cb(null, []);
      }
    });
}

/**
 * getHS300 - 获取沪深300股票信息
 * 返回数据格式: 数组
 * [
 *   {
 *     symbol: 股票代码, 如：sh600000
 *     name: 股票名称
 *     trade: 最新价
 *     pricechange: 涨跌额
 *     changepercent: 涨跌幅
 *     buy: 买入价
 *     sell: 卖出价
 *     settlement: 昨收
 *     open: 开盘价
 *     high: 最高价
 *     low: 最低价
 *     volume: 成交量（手）
 *     amount: 成交额（万）
 *     code: 股票六位代码, 如: 600000
 *     ticktime:
 *     focus:
 *     fund:
 *   }
 * ]
 *
 * @param cb
 * @returns {undefined}
 */
export function getHS300(cb) {
  const url = hs300Url();

  request
    .get(url)
    .charset('gbk')
    .buffer()
    .end(function(err, res) {
      if(err || !res.ok) {
        cb(err);
      } else if(res.text) {
        let json = JSON.parse(res.text)[0];
        let items = json.items.map(function(ele) {
          let obj = {};
          ele.forEach((s, i) => {
            let field = json.fields[i];
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
        cb(null, items);
      } else {
        cb(null, []);
      }
    });
}
