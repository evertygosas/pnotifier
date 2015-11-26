
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var apn = require('apn');
var _ = require('lodash');
var utils = require('../lib/utils');

/**
 * Initialize 
 * @param {object} params, service parameters
 * @param {object} emitter, EventEmitter (not used yet)
 */
var ApnService = function (params, emitter) {
  this.protocol = 'apn';
  this.emitter = emitter;
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {}; 
};

/**
 * Create a connexion to the Apple Notification Service
 * @param {function} next
 */
ApnService.prototype.createConnection = function (next) {

  var vm = this;
  var required = ['cert','key','token'];

  var missing = utils.missingProperty(required, this.credentials);

  if (!_.isEmpty(missing)) {
    return next(utils.listMissingProperties(missing, 'credentials'));
  }

  _.merge(this.options, this.credentials);

  try {
    this.connection = new apn.Connection(this.options);
    return next(null, this.connection);
  } catch (e) {
    return next(e);
  }

};

/**
 * Send a notification to the Apple Notification Service.
 * @param {object} data, data to send
 * @param {function} next
 */
ApnService.prototype.send = function (data, next) {

  var vm = this;

  var required = ['alert','payload'];

  var missing = utils.missingProperty(required, data);

  if (!_.isEmpty(missing)) {
    return next(utils.listMissingProperties(missing));
  }

  try {

    if (!(this.device = new apn.Device(this.options.token)))
      throw new Error('Invalid token. Device not found.');

    var note = new apn.Notification();

    note.expiry = data.expiry || Math.floor(Date.now() / 100) + 3600;
    note.badge = data.badge || 1;
    note.sound = data.sound || 'ping.aiff';
    note.alert = data.alert;
    note.payload = data.payload;

    var ret = this.connection.sendNotification(note, this.device);
    return next(null, { message: 'sent!' });
  } catch (e) {
    return next(e);
  }
};

/**
 * Provide protocol (service name)
 */
ApnService.prototype.getProtocol = function () {
  return this.protocol;
}

/**
 * Close connection with APN servers
 * @param {function} next, will be executed 2600ms after the shutting down
 */
ApnService.prototype.close = function (next) {
  this.connection.shutdown();
  if (next) setTimeout(next, 2600);
};

/**
 * Exporting the module
 */
module.exports = ApnService;
