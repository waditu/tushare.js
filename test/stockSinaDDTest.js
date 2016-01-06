var tushare = require('../lib/index');
var test = require('tape');

test('Get Tick Data', function(t) {
  t.plan(2);
  tushare.stock.getSinaDD(function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of da dan data');
  });

  var options = {
    code: '600848',
    volume: 700
  };
  tushare.stock.getSinaDD(options, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of da dan data');
  });
});
