var tushare = require('../lib/index');
var test = require('tape');

test('Get Day Price', function(t) {
  t.plan(2);
  tushare.stock.getSinaClassifyDetails(function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of stocks of an industry');
    t.ok(data.length > 0, 'It should return more than one stocks in an industry');
  });
});
