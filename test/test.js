var assert = require('assert');
var Pnotify = require('../').Service;
var Emitter = require('events').EventEmitter;

var errCb = function (err) {
	console.log("APN ERROR: ", err);
};

describe('00 Basic APN test', function () {

	it('should create an instance of ApnService', function () {

		
	
	});

	describe('01 Basic GCM test', function () {
		assert.equal('apn', 'apn');
	});

});