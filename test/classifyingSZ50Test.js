import test from 'ava';
import { stock } from '../src';

test('Get SZ50 Stock Data', t => {
  t.plan(2);
  return stock.getSZ50().then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of stocks');
    t.truthy(data.length === 50, 'It should return 50 records');
  });
});
