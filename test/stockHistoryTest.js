import test from 'ava';
import { stock } from '../src';

test('Get Day Price', t => {
  t.plan(3);
  const query = { code: '600848' };
  return stock.getHistory(query).then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of day price');
    t.truthy(data.record, 'The returned data should have a key with name `record`');
    t.truthy(data.record.length, 'It should not return an empty array');
  });
});

test('Get Week Price', t => {
  t.plan(3);
  const query = {
    code: '600848',
    ktype: 'week',
  };
  return stock.getHistory(query).then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of day price');
    t.truthy(data.record, 'The returned data should have a key with name `record`');
    t.truthy(data.record.length, 'It should not return an empty array');
  });
});

test('Get Minute Price', t => {
  t.plan(3);
  const query = {
    code: '600848',
    ktype: '15',
  };
  return stock.getHistory(query).then(({ data }) => {
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of day price');
    t.truthy(data.record, 'The returned data should have a key with name `record`');
    t.truthy(data.record.length, 'It should not return an empty array');
  });
});
