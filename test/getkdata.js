/* eslint no-unused-vars: ["error", {"args" : "none"}]*/
import test from 'ava';
import { stock } from '../src';

const strftime = require('strftime');
const util = require('util');

test.cb('Get Special case for long time ago', t => {
  t.plan(1);
  const opt = {};
  opt.code = '000002';
  opt.start = '2002-01-01';
  opt.end = '2002-04-06';
  const callback = function cb(data) {
    t.truthy(data.length >= 20, 'get data length 20');
    t.end();
  };
  opt.cb = callback;
  opt.args = null;
  stock.getKData(opt).then(callback).catch(err => {
    t.truthy(false, util.format('long time getkdata error %s', err));
  });
});

const _getTimeTick = ts => {
  const sarr = ts.split('-');
  let retval = 0;
  if (sarr.length >= 3) {
    retval += parseInt(sarr[0], 10) * 100 * 100;
    retval += parseInt(sarr[1], 10) * 100;
    retval += parseInt(sarr[2], 10);
    retval *= 10000;
  } else {
    retval += parseInt(ts, 10);
  }
  return retval;
};

const _getTimeTickShort = ts => {
  let retval = 0;
  retval += parseInt(ts, 10);
  return retval;
};


test.cb('Get short time index', t => {
  const opt = {};
  const etime = new Date();
  const stime = new Date(etime.getTime() - (24 * 365 * 3600 * 1000));
  const sdate = strftime('%Y-%d-%m', stime);
  const edate = strftime('%Y-%d-%m', etime);
  opt.code = '000001';
  opt.index = true;
  opt.ktype = '5';
  opt.start = sdate;
  opt.end = edate;
  const callback = function cb(data) {
    let curtick;
    const stick = _getTimeTick(sdate);
    const etick = _getTimeTick(edate);
    let idx = 0;
    t.truthy(data.length >= 20, 'get data for index');
    while (idx < data.length) {
      const d = data[idx];
      curtick = _getTimeTickShort(d[0]);
      t.truthy(curtick >= stick && curtick <= etick, util.format('%s >= %s && %s <= %s', curtick, stick, curtick, etick));
      idx += 1;
    }
    t.end();
  };
  opt.cb = callback;
  opt.args = null;
  stock.getKData(opt).then(callback).catch( err => {
    t.truthy(false, util.format('short time index error %s', err));
    t.end();
  });
});

test.cb('get data for sequence', t => {
  const opt = {};
  const etime = new Date();
  const stime = new Date(etime.getTime() - (24 * 365 * 3600 * 1000));
  const sdate = strftime('%Y-%d-%m', stime);
  const edate = strftime('%Y-%d-%m', etime);
  opt.code = '000001';
  opt.index = true;
  opt.ktype = '5';
  opt.start = sdate;
  opt.end = edate;
  const callback = function cb(data) {
    let curtick;
    let idx = 0;
    let lastval = 0;
    let curval = 0;
    let lastd;
    t.truthy(data.length >= 20, 'get data for index');
    lastd = '';
    data.forEach(function(d) {
      curval = _getTimeTick(d[0]);
      t.truthy(curval >= lastval, util.format('%s for %s not sequence', lastd, d));
      lastval = curval;
      lastd = d;
    });

    t.end();
  };
  opt.cb = callback;
  opt.args = null;
  stock.getKData(opt).then(callback).catch(err => {
      t.truthy( false , util.format('get sequence error %s', err));
      t.end();
  });
});
