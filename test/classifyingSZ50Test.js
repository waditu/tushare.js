import test from 'ava';
import { stock } from '../lib';

test('Get SZ50 Stock Data', t => {
  t.plan(2);
  return stock.getSZ50().then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of stocks');
    t.truthy(data.length === 50, 'It should return 50 records');
  });
});
