import test from 'ava';
import { stock } from '../lib';

test('Get Concepts Classify', t => {
  t.plan(2);
  return stock.getSinaConceptsClassified().then(({ data }) => {
    console.log(JSON.stringify(data));
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array concepts classified data');
    t.truthy(data.length > 0, 'It should return more than one concepts classified data');
  });
});
