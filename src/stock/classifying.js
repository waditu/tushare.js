import request from 'superagent-charset';
import {
  sinaIndustryIndexUrl,
  sinaClassifyDetailUrl,
  sinaConceptsIndexUrl,
  allStockUrl,
  hs300Url,
  sz50Url,
} from './urls';
import { csvToObject, arrayObjectMapping, checkStatus } from './util';
import { charset } from '../utils/charset';
import '../utils/fetch';

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
export const getSinaIndustryClassified = () => {
  const url = sinaIndustryIndexUrl();
  const mapData = data => {
    const result = [];
    const json = JSON.parse(data.split('=')[1].trim());
    Object.keys(json).forEach(tag => {
      const industryArr = json[tag].split(',');
      result.push({
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
        leadingName: industryArr[12],
      });
    });
    return { data: result };
  };

  return fetch(url, { disableDecoding: true })
  .then(checkStatus)
  .then(charset('GBK'))
  .then(mapData)
  .catch(error => ({ error }));
};

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
/* eslint-disable no-eval */
export const getSinaClassifyDetails = (query = {}) => {
  const defaults = {
    tag: 'new_jrhy', // 默认金融行业
  };
  const options = Object.assign({}, defaults, query);
  const url = sinaClassifyDetailUrl(options.tag);
  const mapData = data => {
    let result = [];
    result = eval(data);
    if (result) {
      result = result.map(ele => ({
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
        tickTime: ele.ticktime,
      }));
    }
    return { data: result };
  };

  return fetch(url, { disableDecoding: true })
  .then(checkStatus)
  .then(charset('GBK'))
  .then(mapData)
  .catch(error => ({ error }));
};

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
export const getSinaConceptsClassified = () => {
  const url = sinaConceptsIndexUrl();
  const mapData = data => {
    const json = JSON.parse(data.split('=')[1].trim());
    const result = Object.keys(json).map(tag => {
      const conceptsArr = json[tag].split(',');
      return {
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
        leadingName: conceptsArr[12],
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
export const getAllStocks = () => {
  const url = allStockUrl();

  return fetch(url)
  .then(checkStatus)
  .then(charset('GBK'))
  .then(data => ({ data: csvToObject(data) }))
  .catch(error => ({ error }));
};

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
export const getHS300 = () => {
  const url = hs300Url();

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(json => ({ data: arrayObjectMapping(json[0].fields, json[0].items) }))
  .catch(error => ({ error }));
};

/**
 * getSZ50 - 获取上证50股票信息
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
export const getSZ50 = () => {
  const url = sz50Url();

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(json => ({ data: arrayObjectMapping(json[0].fields, json[0].items) }))
  .catch(error => ({ error }));
};
