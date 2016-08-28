import test from 'ava';
import { stock } from '../lib';

test('Get Day Price', t => {
  t.plan(1);
  const query = { code: '600848' };
  return stock.getHistory(query).then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of day price');
  });
});

test('Get Week Price', t => {
  t.plan(1);
  const query = {
    code: '600848',
    ktype: 'week',
  };
  return stock.getHistory(query).then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of day price');
  });
});

test('Get Minute Price', t => {
  t.plan(1);
  const query = {
    code: '600848',
    ktype: '15',
  };
  return stock.getHistory(query).then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of day price');
  });
});
