
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var apn = require('apn');
var _ = require('lodash');
var sysu = require('util');
var utils = require('../lib/utils');
var EventEmitter = require('events').EventEmitter;

/**
 * Initialize
 * @param {object} params, service parameters
 * @param {object} emitter, EventEmitter (not used yet)
 */
var ApnService = function (params) {
  EventEmitter.call(this);

  this.protocol = 'apn';
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {};
};

sysu.inherits(ApnService, EventEmitter);

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
    next(null, this.connection);
  } catch (e) {
    return next(e);
  }
  this.connection.on("connected", function() {
    if (process.env.DEBUG) console.log("APN Connected");
  });
  this.connection.on("timeout", function() {
    if (process.env.DEBUG) console.log("APN Timeout");
  });
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

    note.expiry = data.expiry || Math.floor(Date.now() / 1000) + 3600;
    note.badge = data.badge || 1;
    note.sound = data.sound || 'ping.aiff';
    note.alert = data.alert;
    note.payload = data.payload;

    this.connection.on("transmitted", function(notification, device) {
      if (device.token.toString('hex') == this.options.token) {
        // Sent message OK : callback
        return next(null, {message: 'sent!'});
      } else {
        if (process.env.DEBUG) console.log("transmitted event with wrong token : " + device.token.toString('hex'));
        return next("Error : transmitted event woth wrong token : " + device.token.toString('hex'));
      }
    });
    this.connection.on("transmissionError", function(errCode, notification, device) {
      if (process.env.DEBUG) console.log("transmissionError : " + errCode);
      // Commented out because a failed message also calls transmitted event :(
      // if (errCode == 8)
      //   return next("APN Error : invalid token");
      // return next("APN Error code " + errCode);
    });

    if (process.env.DEBUG) console.log("APN Sending message...");
    var ret = this.connection.pushNotification(note, this.device);

    //return next(null, { message: 'sent!' });
  } catch (e) {
    if (process.env.DEBUG) console.log("Transmission error", e);
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
 * @param {function} next, will be executed after confirmed shutdown
 */
ApnService.prototype.close = function (next) {
  this.connection.on("disconnected", function() {
    if (process.env.DEBUG) console.log("APN Disconnected");
    if (next) return next();
  });
  this.connection.on("sockerError", function() {
    if (process.env.DEBUG) console.log("APN SocketError");
    if (next) return next();
  });
  this.connection.shutdown();
};

/**
 * Calls APNS Feedback service to get failed tokens
 * @param {function} cb, called with devices array parameter
 */
ApnService.prototype.feedback = function(cb) {
  this.options["batchFeedback"] = true;
  this.options["interval"] = 0;
  var feedback = new apn.Feedback(this.options);
  feedback.on("feedback", function(devices) {
    cb(devices);
  });
}

/**
 * Exporting the module
 */
module.exports = ApnService;
