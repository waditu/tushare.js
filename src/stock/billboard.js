import { lhbUrl, blockTradeUrl, longPeriodRankUrl } from './urls';
import { codeToSymbol, checkStatus } from './util';
import { DATE_NOW } from './cons';
import '../utils/fetch';

/**
 * lhb - 获取龙虎榜数据
 * [
 *  {
 *    symbol: 股票代码
 *    name: 股票名称
 *    price: 收盘价格
 *    date: 日期哦
 *    changePercent: 涨跌幅
 *    type: 上榜理由
 *    volume: 成交量（手）
 *    amount: 成交额（万）
 *  }
 * ]
 */
export const lhb = (query = {}) => {
  const defaults = {
    start: DATE_NOW,
    end: DATE_NOW,
    pageNo: 1,
    pageSize: 150,
  };
  const options = Object.assign({}, defaults, query);
  const url = lhbUrl(options.start, options.end, options.pageNo, options.pageSize);
  const mapData = data => {
    const result = {};
    result.page = data.page + 1;
    result.total = data.total;
    result.pageCount = data.pagecount;
    result.items = data.list.map(item => ({
      symbol: codeToSymbol(item.SYMBOL),
      name: item.SNAME,
      price: item.TCLOSE,
      date: item.TDATE,
      changePercent: item.PCHG,
      type: item.SMEBTSTOCK1,
      volume: item.VOTURNOVER * 100,
      amount: item.VATURNOVER * 100,
    }));
    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(mapData)
  .catch(error => ({ error }));
};

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
 */
export const blockTrade = (query = {}) => {
  const defaults = {
    start: DATE_NOW,
    end: DATE_NOW,
    pageNo: 1,
    pageSize: 150,
  };
  const options = Object.assign({}, defaults, query);
  const url = blockTradeUrl(options.start, options.end, options.pageNo, options.pageSize);
  const mapData = data => {
    const result = {};
    result.page = data.page + 1;
    result.total = data.total;
    result.pageCount = data.pagecount;
    result.items = data.list.map(item => ({
      symbol: codeToSymbol(item.SYMBOL),
      name: item.SNAME,
      dealPrice: item.DZJY5,
      price: item.TCLOSE,
      date: item.PUBLISHDATE,
      volume: item.DZJY2 * 100,
      amount: item.DZJY6,
      buyer: item.DZJY9,
      seller: item.DZJY11,
      dopRate: item.DZJY55,
    }));
    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(mapData)
  .catch(error => ({ error }));
};

/**
 * longPeriodRank - 长期阶段涨跌幅
 * 返回数据格式:
 * [
 *  {
 *    symbol: 股票代码
 *    name: 股票名称
 *    price: 股票价格
 *    date: 时间
 *    dayPercent: 单日涨跌幅
 *    weekPercent: 周涨跌幅
 *    monthPercent: 月涨跌幅
 *    quarterPercent: 季度涨跌幅
 *    halfYearPercent: 半年涨跌幅
 *    yearPercent: 年度涨跌幅
 *  }
 * ]
 */
export const longPeriodRank = (query = {}) => {
  const defaults = {
    period: 'month',
    pageNo: 1,
    pageSize: 100,
  };
  const options = Object.assign({}, defaults, query);
  const url = longPeriodRankUrl(options.period, options.pageNo, options.pageSize);
  const mapData = data => {
    const result = {};
    result.page = data.page + 1;
    result.total = data.total;
    result.pageCount = data.pagecount;
    result.items = data.list.map(item => ({
      symbol: codeToSymbol(item.CODE),
      name: item.NAME,
      price: item.PRICE,
      date: item.LONG_PERIOD_RANK.TIME,
      dayPercent: item['PERCENT'],
      weekPercent: item['LONG_PERIOD_RANK']['WEEK_PERCENT'],
      monthPercent: item['LONG_PERIOD_RANK']['MONTH_PERCENT'],
      quarterPercent: item['LONG_PERIOD_RANK']['QUARTER_PERCENT'],
      halfYearPercent: item['LONG_PERIOD_RANK']['HALF_YEAR_PERCENT'],
      yearPercent: item['LONG_PERIOD_RANK']['YEAR_PERCENT'],
    }));
    return { data: result };
  };

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(mapData)
  .catch(error => ({ error }));
};
