
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var gcm = require('node-gcm');
var _ = require('lodash');


/**
 * Required params:
 * - api_key
 * - tokens
 */

/**
 *
 *
 *
 */
var GcmService = function (emitter, params) {
  this.emitter = emitter;
  this.params  = params || {};
  this.options = this.params.options || {};
};


/**
 *
 *
 *
 */
GcmService.prototype.createConnection = function (next) {

  try {
    this.connection = new gcm.Sender(this.params.api_key);
    next(null);
  } catch (e) {
    this.emitter.emit('error', 'gcm: connection failed.');
    next(e);
  }
};


/**
 *
 *
 *
 */
GcmService.prototype.send = function (data, next) {

  var message = new gcm.Message(this.options);
  message.addData(data);

  var tokens = this.params.tokens;

  this.connection.send(message, { registrationTokens: tokens }, function (err, response) {
    if (err) return this.emitter.emit('error', err);
    next(null, response);
  });
};

module.exports = GcmService;