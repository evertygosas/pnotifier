/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var _ = require('lodash');
var sysu = require('util');
var EventEmitter = require('events').EventEmitter;

// List of supported protocols
var protocols = ['apn','gcm','wns'];

/**
 * Initialize and load requested service.
 * @param {object} options, service options
 */
function Service (options) {

    EventEmitter.call(this);

    this.options = options || {};
    if (!this.options.protocol)
        throw new Error('Missing protocol name.');

    if (typeof this.options.protocol !== 'string')
        throw new Error('Invalid protocol type. Expected String, get ' + typeof this.options.protocol);

    if (_.contains(protocols, this.options.protocol)) {
	this.protocol = this.options.protocol;
        this.service = require('../protocols/' + this.protocol);
        return new this.service(this.options);
    }
    throw new Error('Invalid service named "' + this.options.protocol + '"');
}

/**
 * Provide current Service instance
 */
Service.prototype.getService = function () {
	return this.service;
}

/**
 * Provide current Service name
 */
Service.prototype.getProtocol = function () {
	return this.protocol;
}

//sysu.inherits(Service, EventEmitter);

exports.Service = Service;
exports.protocols = protocols;
