var tushare = require('../lib/index');
var test = require('tape');

test('Get SZ50 Stock Data', function(t) {
  t.plan(2);
  tushare.stock.getSZ50(function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of stocks');
    t.ok(data.length === 50, 'It should return 50 records');
  });
});
