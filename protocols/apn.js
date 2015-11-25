
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var apn = require('apn');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


/**
 * Required params:
 * - cert
 * - key
 */

/**
 *
 *
 *
 */
var ApnService = function (params) {
  this.params  = params || {};
  this.options = this.params.options || {}; 
};


/**
 *
 *
 *
 */
ApnService.prototype.createConnection = function (next) {

  try {

    this.connection = new apn.Connection(this.options);
    next(null);

  } catch (e) {
    return next(e);
  }

};


/**
 *
 *
 *
 */
ApnService.prototype.send = function (data, next) {

  try {
    
    this.device = new apn.Device(this.params.token);
    
    var note = new apn.Notification();

    note.expiry = data.expiry || Math.floor(Date.now() / 100) + 3600;
    note.badge = data.badge || 1;
    note.sound = data.sound || 'ping.aiff';
    note.alert = data.alert;
    note.payload = data.payload;

    this.connection.sendNotification(note, this.device);
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
ApnService.prototype.close = function (next) {
  this.connection.shutdown();
  if (next) setTimeout(next, 2600);
};

module.exports = ApnService;
