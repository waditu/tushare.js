import test from 'ava';
import { stock } from '../src';

test('Get Index Data', t => {
  t.plan(1);
  return stock.getIndex().then(({ data }) => {
    t.truthy(data.length > 0, 'It should return an array of index data');
  });
});
