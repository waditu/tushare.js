var tushare = require('../lib/index');
var test = require('tape');

test('Get All Stock Data', function(t) {
  t.plan(1);
  var options = {
    start: '2016-01-15',
    end: '2016-01-15'
  };
  tushare.stock.lhb(options, function(err, data) {
    t.ok(data.items.length > 0, 'It should return more than one stocks');
  });
});
