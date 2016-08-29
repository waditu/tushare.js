import test from 'ava';
import { stock } from '../lib';

test('Get default classifying Details', t => {
  t.plan(2);
  return stock.getSinaClassifyDetails().then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of stocks of an industry');
    t.truthy(data.length > 0, 'It should return more than one stocks in an industry');
  });
});

test('Get specified classifying Details', t => {
  t.plan(2);
  const options = {
    tag: 'gn_zndw',
  };
  return stock.getSinaClassifyDetails(options).then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of stocks of an industry');
    t.truthy(data.length > 0, 'It should return more than one stocks in an industry');
  });
});
