
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var gcm = require('node-gcm');
var _ = require('lodash');
var utils = require('../lib/utils');

/**
 * Initialize 
 * @param {object} params, service parameters
 * @param {object} emitter, EventEmitter (not used yet)
 */
var GcmService = function (params, emitter) {
  this.protocol = 'gcm';
  this.emitter = emitter;
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {}; 
};

/**
 * Create a connexion to the Google Cloud Messaging service.
 * @param {function} next
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
    return next(null);
  } catch (e) {
    next(e);
  }
};

/**
 * Send a notification to the Google Cloud Messaging service.
 * @param {object} data, data to send
 * @param {function} next
 */
GcmService.prototype.send = function (data, next) {

  try {

    var tokens = this.credentials.tokens;
    var message = new gcm.Message(this.options);
    message.addData(data);

    this.connection.send(message, { registrationTokens: tokens }, function (err, response) {
      if (err) return next(err);
      next(null, response);
    });

  } catch (e) {
    return next(e);
  }

};

/**
 * Provide protocol (service name)
 */
GcmService.prototype.getProtocol = function () {
  return this.protocol;
}

/**
 * Do nothing except executing the given callback.
 * @param {function} next, callback
 */
GcmService.prototype.close = function (next) {
  next();
};

/**
 * Exporting the module
 */
module.exports = GcmService;