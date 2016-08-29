import test from 'ava';
import { stock } from '../lib';

test('Get Long Period Rank Data by month', t => {
  const options = {
    period: 'month',
    pageNo: 1,
    pageSize: 100,
  };
  return stock.longPeriodRank(options).then(({ data }) => {
    t.truthy(data.items.length === 100, 'It should return 100 records');
  });
});

test('Get Long Period Rank Data by month', t => {
  const options = {
    period: 'quarter',
    pageNo: 1,
    pageSize: 100,
  };
  return stock.longPeriodRank(options).then(({ data }) => {
    t.truthy(data.items.length === 100, 'It should return 100 records');
  });
});
