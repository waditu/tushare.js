import test from 'ava';
import { stock } from '../src';

test('Get Tick Data', t => {
  t.plan(1);
  return stock.getTodayAll().then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of today stock data');
  });
});

test('Get Tick Data', t => {
  t.plan(1);
  const query = {
    pageSize: 80,
    pageNo: 1,
  };
  return stock.getTodayAll(query).then(({ data }) => {
    t.truthy(data.length, 80, 'It should return 80 results');
  });
});
