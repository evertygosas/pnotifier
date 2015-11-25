var assert = require('assert');
var Pnotify = require('../').Service;

var errCb = function (err) {
	console.log("APN ERROR: ", err);
};

describe('00 Basic APN test', function () {

	it('should create an instance of ApnService', function () {

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
	});

	describe('01 Basic GCM test', function () {

	
	});

});