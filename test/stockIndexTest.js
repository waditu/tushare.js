var tushare = require('../lib/index');
var test = require('tape');

test('Get Tick Data', function(t) {
  t.plan(1);
  tushare.stock.getIndex(function(err, data) {
    t.ok(data.length > 0, 'It should return an array of index data');
  });

});
