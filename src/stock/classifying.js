import request from 'superagent-charset';
import {
  sinaIndustryIndexUrl
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
