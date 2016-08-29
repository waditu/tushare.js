/* eslint-disable */
if (typeof module !== undefined && module.exports) {
  var realFetch = require('no-fetch');
  module.exports = function(url, options) {
    if (/^\/\//.test(url)) {
      url = 'https:' + url;
    }
    return realFetch.call(this, url, options);
  };

  if (!global.fetch) {
    global.fetch = module.exports;
    global.Response = realFetch.Response;
    global.Headers = realFetch.Headers;
    global.Request = realFetch.Request;
  }
} else {
  require('whatwg-fetch');
  module.exports = self.fetch.bind(self);
}
