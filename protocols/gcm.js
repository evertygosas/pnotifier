
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var gcm = require('node-gcm');
var _ = require('lodash');
var utils = require('../lib/utils');


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
var GcmService = function (params, emitter) {
  this.protocol = 'gcm';
  this.emitter = emitter;
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {}; 
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
    var missing = utils.missingProperty(required, this.credentials);

    if (!_.isEmpty(missing)) {
      return next(utils.listMissingProperties(missing, 'credentials'));
    }

    this.connection = new gcm.Sender(this.credentials.api_key);
    next(null);
  } catch (e) {
    next(e);
  }
};


/**
 *
 *
 *
 */
GcmService.prototype.send = function (data, next) {

  try {
    var message = new gcm.Message(this.options);

    message.addData(data);

    var tokens = this.credentials.tokens;

    this.connection.send(message, { registrationTokens: tokens }, function (err, response) {
      if (err) return next(err);
      next(null, response);
    });

  } catch (e) {
    return next(e);
  }

};


GcmService.prototype.getProtocol = function () {
  return this.protocol;
}

GcmService.prototype.close = function (next) {
  next();
};

module.exports = GcmService;