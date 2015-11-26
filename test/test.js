
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

var assert = require('assert');
var rs = require('randomstring');
var Pnotify = require('../').Service;

var errCb = function (err) {
	console.log("APN ERROR: ", err);
};

describe('00 General tests.', function () {

	it('should return an error without any protocol.', function () {

		var ret;

		try {

			var service = new Pnotify({});

		} catch (e) {
			ret = e.message;
		}

		assert.strictEqual(ret, 'Missing protocol name.');
	});

	it('should return an error with invalid type of protocol.', function () {

		var ret;
		var invalid = [rs.generate(5)];

		try {

			var service = new Pnotify({
				protocol: invalid
			});

		} catch (e) {
			ret = e.message;
		}
		assert.strictEqual(ret, 'Invalid protocol type. Expected String, get ' + typeof invalid);
	});

	it('should return an error with an invalid protocol.', function () {

		var name = rs.generate(3);
		var ret;

		try {

			var service = new Pnotify({
				protocol: name
			});

		} catch (e) {
			ret = e.message;
		}

		assert.strictEqual(ret, 'Invalid service named "' + name + '"');
	});
});

describe('01 Basic APN tests.', function () {
	
	describe('Mandatory parameters.', function () {

		it('should return an error without any required parameters.', function () {

			var service = new Pnotify({
				protocol: 'apn'
			});

			service.createConnection(function (err) {
				assert.strictEqual(err.message, 'credentials.cert, credentials.key, credentials.token is missing.');
			});

		});

		it('should return an error without two parameters.', function () {

			var service = new Pnotify({
				protocol: 'apn',
				credentials: {
					cert: 'cert.pem',
				}
			});

			service.createConnection(function (err) {
				assert.strictEqual(err.message, 'credentials.key, credentials.token is missing.');
			});
		});

		it('should return an error without only one parameter.', function () {

			var service = new Pnotify({
				protocol: 'apn',
				credentials: {
					cert: 'cert.pem',
					key: 'key.pem',
				}
			});

			service.createConnection(function (err) {
				assert.strictEqual(err.message, 'credentials.token is missing.');
			});

		});

		it('should return ok with all needed parameters.', function () {

			var service = new Pnotify({
				protocol: 'apn',
				credentials: {
					cert: 'cert.pem',
					key: 'key.pem',
					token: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);
			});

		});

	});

	describe('Sending Mandatory parameters.', function () {

		it('should return an error without any data specified.', function () {

			var service = new Pnotify({
				protocol: 'apn',
				credentials: {
					cert: 'cert.pem',
					key: 'key.pem',
					token: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);

				service.send({}, function (err) {
					assert.strictEqual(err.message, 'alert, payload is missing.');
				});
			});
		});

		it('should return an error with only one data specified.', function () {

			var service = new Pnotify({
				protocol: 'apn',
				credentials: {
					cert: 'cert.pem',
					key: 'key.pem',
					token: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);

				service.send({alert: 'Hello World!'}, function (err) {
					assert.strictEqual(err.message, 'payload is missing.');
				});
			});
		});
	});

	describe('01.1 Direct call to APN', function () {

		it('should return ok with a direct call of APN service.', function () {

			var Apn = require('../').apn;

			var service = new Apn({
				credentials: {
					cert: 'cert.pem',
					key: 'key.pem',
					token: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);
			});
		});

	});

});

describe('02 Basic GCM tests.', function () {
	
	describe('Mandatory parameters.', function () {

		it('should return an error without any required parameters.', function () {

			var service = new Pnotify({
				protocol: 'gcm'
			});

			service.createConnection(function (err) {			
				assert.strictEqual(err.message, 'credentials.api_key, credentials.tokens is missing.');
			});

		});

		it('should return an error without only one parameter.', function () {

			var service = new Pnotify({
				protocol: 'gcm',
				credentials: {
					api_key: rs.generate(),
				}
			});

			service.createConnection(function (err) {
				assert.strictEqual(err.message, 'credentials.tokens is missing.');
			});

		});

		it('should return ok with all needed parameters.', function () {

			var service = new Pnotify({
				protocol: 'gcm',
				credentials: {
					api_key: rs.generate(),
					tokens: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);
			});

		});

	});

	describe('Sending Mandatory parameters.', function () {

		it('should return an error without any data specified.', function () {

			var service = new Pnotify({
				protocol: 'gcm',
				credentials: {
					api_key: rs.generate(),
					tokens: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);

				service.send({}, function (err) {
					assert.strictEqual(err.message, 'alert, payload is missing.');
				});
			});
		});

		it('should return an error with only one data specified.', function () {

			var service = new Pnotify({
				protocol: 'gcm',
				credentials: {
					api_key: rs.generate(),
					tokens: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);

				service.send({alert: 'Hello World!'}, function (err) {
					assert.strictEqual(err.message, 'payload is missing.');
				});
			});
		});
	});


	describe('02.1 Direct call to GCM.', function () {

		it('should return ok with a direct call of GCM service.', function () {

			var Gcm = require('../').gcm;

			var service = new Gcm({
				credentials: {
					api_key: rs.generate(),
					tokens: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);
			});
		});
	});

});

describe('03 Basic WNS tests.', function () {
	describe('Mandatory parameters.', function () {

		it('should return an error without any required parameters.', function () {

			var service = new Pnotify({
				protocol: 'wns',
			});

			service.createConnection(function (err) {			
				assert.strictEqual(err.message,
					'credentials.client_id, credentials.client_secret, credentials.channelURI is missing.');
			});

		});

		it('should return an error without two parameters.', function () {

			var service = new Pnotify({
				protocol: 'wns',
				credentials: {
					client_id: rs.generate(),
				}
			});

			service.createConnection(function (err) {
				assert.strictEqual(err.message,
					'credentials.client_secret, credentials.channelURI is missing.');
			});
		});

		it('should return an error without only one parameter.', function () {

			var service = new Pnotify({
				protocol: 'wns',
				credentials: {
					client_id: rs.generate(),
					client_secret: rs.generate(),
				}
			});

			service.createConnection(function (err) {
				assert.strictEqual(err.message, 'credentials.channelURI is missing.');
			});

		});

		it('should return ok with all needed parameters.', function () {

			var service = new Pnotify({
				protocol: 'wns',
				credentials: {
					client_id: rs.generate(),
					client_secret: rs.generate(),
					channelURI: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);
			});

		});

	});

	describe('Sending Mandatory parameters.', function () {

		it('should return an error without any data specified.', function () {

			var service = new Pnotify({
				protocol: 'wns',
				credentials: {
					client_id: rs.generate(),
					client_secret: rs.generate(),
					channelURI: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);

				service.send({}, function (err) {
					assert.strictEqual(err.message, 'alert, payload is missing.');
				});
			});
		});

		it('should return an error with only one data specified.', function () {

			var service = new Pnotify({
				protocol: 'wns',
				credentials: {
					client_id: rs.generate(),
					client_secret: rs.generate(),
					channelURI: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);

				service.send({alert: 'Hello World!'}, function (err) {
					assert.strictEqual(err.message, 'payload is missing.');
				});
			});
		});
	});


	describe('03.1 Direct call to WNS', function () {

		it('should return ok with a direct call of WNS service.', function () {

			var Wns = require('../').wns;

			var service = new Wns({
				credentials: {
					client_id: rs.generate(),
					client_secret: rs.generate(),
					channelURI: rs.generate()
				}
			});

			service.createConnection(function (err) {
				assert.ifError(err);
			});
		});
	});
});