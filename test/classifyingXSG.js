import test from 'ava';
import { stock } from '../src';

test('Get XSG Stock Data', t => stock.getXSGData().then(data => {
  t.truthy(Object.prototype.toString.apply(data) === '[object Array]',
    'It should return an array of stocks');
}));
