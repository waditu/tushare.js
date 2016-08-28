import test from 'ava';
import { stock } from '../lib';

test('Get All Stock Data', t => {
  const options = {
    start: '2016-01-15',
    end: '2016-01-15',
  };
  return stock.lhb(options).then(({ data }) => {
    t.truthy(data.items.length > 0, 'It should return more than one stocks');
  });
});
