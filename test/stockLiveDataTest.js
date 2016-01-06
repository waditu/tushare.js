var tushare = require('../lib/index');
var test = require('tape');

test('Get Tick Data', function(t) {
  t.plan(2);
  var options = {
    codes: [
      '600848',
      '600000'
    ]
  };
  tushare.stock.getLiveData(options, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of live data for the specified stock symbol');
    t.ok(data.length === 2, 'It should return the same number of stock symbols which passed in');
  });

});
