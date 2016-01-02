var tushare = require('../lib/index');
var test = require('tape');

test('Get Tick Data', function(t) {
  t.plan(1);
  var stock = {
    code: '600848',
    date: '2015-12-31'
  };
  tushare.stock.getTick(stock, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return the object of day price');
  });
});
