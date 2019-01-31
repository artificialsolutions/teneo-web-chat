require('jsdom-global')();
global.expect = require('chai').expect;
window.Date = Date;
global.SVGElement = global.Element;
