import test from 'ava';
import { stock } from '../lib';

test('Get HS300 Stock Data', t => {
  t.plan(2);
  return stock.getHS300().then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of stocks');
    t.truthy(data.length === 300, 'It should return 300 records');
  });
});
