/**
 * Pnotifier - Push Notification Services Abstraction
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

	this.options = options || {};

	if (!this.options.protocol)
		throw new Error('Missing protocol name.')
	if (typeof this.options.protocol !== 'string')
		throw new Error('Invalid protocol type. Expected String, get ' + typeof this.options.protocol);

	if (_.contains(protocols, this.options.protocol)) {
		this.service = eval('exports.' + this.options.protocol);
		return new this.service(this.options, this);
	}
	throw new Error('Invalid service named "' + this.options.protocol + '"');
};

exports.Service.prototype.__proto__ = EventEmitter.prototype;

exports.Service.prototype.getService = function () {
	return this.service;
};
