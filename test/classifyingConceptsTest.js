var tushare = require('../lib/index');
var test = require('tape');

test('Get Concepts Classify', function(t) {
  t.plan(2);
  tushare.stock.getSinaConceptsClassified(function(err, data) {
    t.ok(Object.prototype.toString.apply(data) === '[object Array]', 'It should return an array concepts classified data');
    t.ok(data.length > 0, 'It should return more than one concepts classified data');
  });
});
