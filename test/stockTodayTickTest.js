var tushare = require('../lib/index');
var test = require('tape');

test('Get Tick Data', function(t) {
  t.plan(3);
  var options = {
    code: '600848',
    end: '15:00:00'
  };
  tushare.stock.getTodayTick(options, function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Object]', 'It should return the object of today tock price');
    t.ok(data.end === options.end, 'It should has the same end time as specified in options');
    t.ok(Object.prototype.toString.apply(data.zhubi_list) === '[object Array]', 'It should return an array of ticks');
  });
});
