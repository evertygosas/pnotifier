/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var protocols = ['apn','gcm','wns'];

protocols.forEach(function (protocol) {
	exports[protocol] = require('./protocols/' + protocol);
});

exports.Service = function (options) {
	EventEmitter.call(this);

	// Event handling
	this.on('error', function (event) {
		console.log(event);
	});

	this.options = options || {};

	if (_.contains(protocols, this.options.protocol)) {
		this.service = eval('exports.' + this.options.protocol);
		return new this.service(this, this.options);
	}
};

exports.Service.prototype.__proto__ = EventEmitter.prototype;

exports.Service.prototype.getService = function () {
	return this.service;
};
