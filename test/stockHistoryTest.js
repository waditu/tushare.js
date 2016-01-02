var tushare = require('../lib/index');
var test = require('tape');

test('Get Day Price', function(t) {
  t.plan(1);
  var stock = {
    code: '600848'
  };
  tushare.stock.getHistory(stock, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Object]', 'It should return the object of day price');
  });
});

test('Get Week Price', function(t) {
  t.plan(1);
  var stock = {
    code: '600848',
    ktype: 'week'
  };
  tushare.stock.getHistory(stock, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Object]', 'It should return the object of day price');
  });
});

test('Get Minute Price', function(t) {
  t.plan(1);
  var stock = {
    code: '600848',
    ktype: '15'
  };
  tushare.stock.getHistory(stock, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Object]', 'It should return the object of day price');
  });
});
