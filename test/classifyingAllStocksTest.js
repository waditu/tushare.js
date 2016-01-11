var tushare = require('../lib/index');
var test = require('tape');

test('Get All Stock Data', function(t) {
  t.plan(2);
  tushare.stock.getAllStocks(function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of stocks');
    t.ok(data.length > 0, 'It should return more than one stocks');
  });
});
