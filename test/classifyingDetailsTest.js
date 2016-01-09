var tushare = require('../lib/index');
var test = require('tape');

test('Get default classifying Details', function(t) {
  t.plan(2);
  tushare.stock.getSinaClassifyDetails(function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of stocks of an industry');
    t.ok(data.length > 0, 'It should return more than one stocks in an industry');
  });
});

test('Get specified classifying Details', function(t) {
  t.plan(2);
  var options = {
    tag: 'gn_zndw'
  };
  tushare.stock.getSinaClassifyDetails(options, function(err, data) {
    console.log(data);
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array of stocks of an industry');
    t.ok(data.length > 0, 'It should return more than one stocks in an industry');
  });
});
