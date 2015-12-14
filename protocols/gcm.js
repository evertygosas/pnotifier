
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var gcm = require('node-gcm');
var _ = require('lodash');
var sysu = require('util');
var EventEmitter = require('events').EventEmitter;
var utils = require('../lib/utils');

/**
 * Initialize 
 * @param {object} params, service parameters
 * @param {object} emitter, EventEmitter (not used yet)
 */
var GcmService = function (params) {
  EventEmitter.call(this);

  this.protocol = 'gcm';
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {};
  this.tokens = [];
};

sysu.inherits(GcmService, EventEmitter);

/**
 * Create a connexion to the Google Cloud Messaging service.
 * @param {function} next
 */
GcmService.prototype.createConnection = function (next) {

  var required = ['api_key'];

  try {

    // Check missing parameters
    var missing = utils.missingProperty(required, this.credentials);

    if (!_.isEmpty(missing)) {
      return next(utils.listMissingProperties(missing, 'credentials'));
    }

    this.connection = new gcm.Sender(this.credentials.api_key);

    return next(null, {message: 'Sender configured.'});
  } catch (e) {
    next(e);
  }
};

/**
 * Send a notification to the Google Cloud Messaging service.
 * @param {object} data, data to send
 * @param {function} next
 */
GcmService.prototype.send = function (tokens, notification, next) {

  try {

    this.tokens = typeof tokens === 'object' ? tokens : [];

    var message = new gcm.Message(this.options);
      
    if (typeof notification === 'object')
      message.addData(notification);

    this.connection.send(message, { registrationTokens: this.tokens }, function (err, response) {
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
  if (next) return next();
};

/**
 * Exporting the module
 */
module.exports = GcmService;
