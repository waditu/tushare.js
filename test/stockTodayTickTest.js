import test from 'ava';
import { stock } from '../lib';

test('Get Tick Data', t => {
  t.plan(2);
  const query = {
    code: '600848',
    end: '15:00:00',
  };
  return stock.getTodayTick(query).then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Object]',
      'It should return the object of today tock price');
    t.truthy(Object.prototype.toString.apply(data.zhubi_list) === '[object Array]',
      'It should return an array of ticks');
  });
});
