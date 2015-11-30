/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var Service = require('./lib/Service');

exports.Service = Service.Service;
exports.service = exports.Service;

// Get all available protocols
var protocols = Service.protocols;

// Export each protocols
protocols.forEach(function (protocol) {
	exports[protocol] = require('./protocols/' + protocol);
});

