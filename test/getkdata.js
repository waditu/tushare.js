/* eslint no-unused-vars: ["error", {"args" : "none"}]*/
import test from 'ava';
import { stock } from '../src';



const strftime = require('strftime');
const util = require('util');

test('Get Special case for long time ago', t => {
  const opt = {};
  opt.code = '000002';
  opt.start = '2002-01-01';
  opt.end = '2002-04-06';
  const callback = function cb(data, args) {
    t.truthy(data.length >= 20, 'get data length 20');
  };
  opt.cb = callback;
  opt.args = null;
  stock.getKData(opt);
});

const _getTimeTick = ts => {
  const sarr = ts.split('-');
  let retval = 0;
  if (sarr.length >= 3) {
    retval += parseInt(sarr[0], 10) * 100 * 100;
    retval += parseInt(sarr[1], 10) * 100;
    retval += parseInt(sarr[2], 10);
    retval *= 10000;
  }
  return retval;
};

const _getTimeTickShort = ts => {
  let retval = 0;
  retval += parseInt(ts, 10);
  return retval;
};


test('Get short time index', t => {
  const opt = {};
  opt.code = '000001';
  opt.index = true;
  opt.ktype = '5';
  const callback = function cb(data,args) {
    const etime = new Date();
    const stime = new Date(etime.getTime() - 24 * 365 * 3600 * 1000);
    const sdate = strftime('%Y-%d-%m', stime);
    const edate = strftime('%Y-%d-%m', etime);
    let curtick;
    const stick = _getTimeTick(sdate);
    const etick = _getTimeTick(edate);
    t.truthy(data.length >= 20,'get data for index');
    data.forEach(function(d) {
        curtick = _getTimeTickShort(d[0]);
        t.truthy(curtick >= stick && curtick <= etick,util.format('%s >= %s && %s <= %s', curtick, stick, curtick, etick));
    })

  };
  opt.cb = callback;
  opt.args = null;
  stock.getKData(opt);
});
