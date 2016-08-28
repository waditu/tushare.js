import test from 'ava';
import { stock } from '../lib';

test('Get Day Price', t => {
  t.plan(2);
  return stock.getSinaIndustryClassified().then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array industry data');
    t.truthy(data.length > 0, 'It should return more than one industry data');
  });
});
