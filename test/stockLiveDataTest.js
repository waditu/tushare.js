import test from 'ava';
import { stock } from '../lib';

test('Get Live Data', t => {
  t.plan(2);
  const query = {
    codes: [
      '600848',
      '600000',
    ],
  };
  return stock.getLiveData(query).then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of live data for the specified stock symbol');

    t.truthy(data.length === 2,
      'It should return the same number of stock symbols which passed in');
  });
});
