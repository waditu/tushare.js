import test from 'ava';
import { stock } from '../lib';

test('Get All Stock Data', t => {
  t.plan(2);
  return stock.getAllStocks().then(({ data }) => {
    console.log(JSON.stringify(data));
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of stocks');
    t.truthy(data.length > 0, 'It should return more than one stocks');
  });
});
