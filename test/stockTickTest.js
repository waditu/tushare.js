import test from 'ava';
import { stock } from '../lib';

test('Get Tick Data', t => {
  t.plan(1);
  const query = {
    code: '600848',
    date: '2015-12-31',
  };
  return stock.getTick(query).then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return the object of day price');
  });
});
