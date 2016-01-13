var tushare = require('../lib/index');
var test = require('tape');

test('Get All Stock Data', function(t) {
  t.plan(1);
  tushare.stock.lhb(function(err, data) {
    t.ok(data.items.length > 0, 'It should return more than one stocks');
  });
});
