
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var apn = require('apn');
var _ = require('lodash');
var utils = require('../lib/utils');

/**
 *
 *
 *
 */
var ApnService = function (emitter, params) {
  this.emitter = emitter;
  this.params  = params || {};
  this.options = this.params.options || {}; 
};


/**
 *
 *
 *
 */
ApnService.prototype.createConnection = function (next) {

  var vm = this;
  var required = ['cert','key'];

  try {

    var missing = utils.missingProperty(required, this.options);

    if (!_.isEmpty(missing)) {
      missing.forEach(function (prop) {
        this.emitter.emit('error', prop + ' is missing.');
      });
    }

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

  var vm = this;

  var required = ['alert','payload'];

  try {

    var missing = utils.missingProperty(required, data);
 
    if (!_.isEmpty(missing)) {
      missing.forEach(function (prop) {
        vm.emit('error', prop + ' is missing.');
      });
    }

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
    this.emitter.emit('error', 'Fail to send Notification.');
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
