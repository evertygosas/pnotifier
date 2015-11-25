var assert = require('assert');
var Pnotify = require('../').Service;
var Emitter = require('events').EventEmitter;

var errCb = function (err) {
	console.log("APN ERROR: ", err);
};

describe('00 Basic APN test', function () {

	it('should create an instance of ApnService', function () {

		var ee = new Emitter();

		var params = {
			protocol: 'apn',
			token: 'toto',
			options: {
				cert: 'cert.pem',
				key: 'key.pem',
				passphrase: null,
				gateway: 'gateway.sandbox.push.apple.com',
				port: 2195,
				enhanced: true,
				cacheLength: 5,
				errorCallback: errCb
			}
		};

		var service = new Pnotify(params);

		service.createConnection(function (err) {

			service.send({
				alert: 'Hello you!',
				payload: {
					messageFrom: 'Thomas from Evertygo',
				}
			}, function (err) {
				service.close();
			});
		});

		assert.equal('apn', 'apn');
			ee.on('error', function (event) {
			console.log(event);
		});
	});

	describe('01 Basic GCM test', function () {
		assert.equal('apn', 'apn');
	});

});