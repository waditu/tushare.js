var tushare = require('../lib/index');
var test = require('tape');

test('Get HS300 Stock Data', function(t) {
  t.plan(2);
  tushare.stock.getHS300(function(err, data) {
    console.log(data);
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of stocks');
    t.ok(data.length === 300, 'It should return 300 records');
  });
});
