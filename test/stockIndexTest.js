import test from 'ava';
import { stock } from '../lib';

test('Get Index Data', t => {
  t.plan(1);
  return stock.getIndex().then(({ data }) => {
    console.log(data);
    t.truthy(data.length > 0, 'It should return an array of index data');
  });
});
