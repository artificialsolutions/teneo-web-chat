require('jsdom-global')('', {
  // Avoid throwing SecurityError when accessing sessionStorage
  url: 'http://some-url.com',
});
global.expect = require('chai').expect;
window.Date = Date;
global.SVGElement = global.Element;
