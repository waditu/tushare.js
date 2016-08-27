import moment from 'moment';

export const K_TYPE = {
  day: 'akdaily',
  week: 'akweekly',
  month: 'akmonthly',
  minute: 'akmin',
};

export const INDEX_LABELS = ['sh', 'sz', 'hs300', 'sz50', 'cyb', 'zxb', 'zx300', 'zh500'];

export const INDEX_LIST = {
  sh: 'sh000001',
  sz: 'sz399001',
  hs300: 'sz399300',
  sz50: 'sh000016',
  zxb: 'sz399005',
  cyb: 'sz399006',
  zx300: 'sz399008',
  zh500: 'sh000905',
};

export const DATE_NOW = moment().format('YYYY-MM-DD');
