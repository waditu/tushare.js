var tushare = require('../lib/index');
var test = require('tape');

test('Get Tick Data', function(t) {
  t.plan(2);
  tushare.stock.getTodayAll(function(err, data) {
    //console.log(data);
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of today stock data');
  });

  tushare.stock.getTodayAll({pageSize: 80, pageNo: 1}, function(err, data) {
    //console.log(data);
    t.equal(data.length, 80, 'It should return 80 results');
  });
});
