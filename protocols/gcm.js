
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

  var required = ['api_key','tokens'];

  try {

    // Check missing parameters
    var missing = utils.missingProperty(required, this.params);

    if (!_.isEmpty(missing)) {
      missing.forEach(function (prop) {
        this.emitter.emit('error', prop + ' is missing.');
      });
    }

    this.connection = new gcm.Sender(this.options.api_key);
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

  var tokens = this.options.tokens;

  this.connection.send(message, { registrationTokens: tokens }, function (err, response) {
    if (err) return this.emitter.emit('error', err);
    next(null, response);
  });
};

module.exports = GcmService;