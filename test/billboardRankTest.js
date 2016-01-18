var tushare = require('../lib/index');
var test = require('tape');

test('Get Long Period Rank Data', function(t) {
  t.plan(2);
  var options1 = {
    period: 'month',
    pageNo: 1,
    pageSize: 100
  };
  tushare.stock.longPeriodRank(options1, function(err, data) {
    t.ok(data.items.length === 100, 'It should return 100 records');
  });

  var options2 = {
    period: 'quarter',
    pageNo: 1,
    pageSize: 100
  };
  tushare.stock.longPeriodRank(options2, function(err, data) {
    t.ok(data.items.length === 100, 'It should return 100 records');
  });
});
