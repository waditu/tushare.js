import test from 'ava';
import { stock } from '../lib';

test('Get Sina Highballing Data', t => {
  const query = {
    code: '600848',
    volume: 70,
    date: '2016-08-26',
  };
  return stock.getSinaDD(query).then(({ data }) => {
    console.log(data);
    t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
      'It should return an array of da dan data');
  });
});
