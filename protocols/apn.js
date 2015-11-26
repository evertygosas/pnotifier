
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
var ApnService = function (params, emitter) {
  this.protocol = 'apn';
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
    return next(null);
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

  var missing = utils.missingProperty(required, data);
 
  if (!_.isEmpty(missing)) {
    return next(utils.listMissingProperties(missing));
  }

  try {

    this.device = new apn.Device(this.options.token);
    
    var note = new apn.Notification();

    note.expiry = data.expiry || Math.floor(Date.now() / 100) + 3600;
    note.badge = data.badge || 1;
    note.sound = data.sound || 'ping.aiff';
    note.alert = data.alert;
    note.payload = data.payload;

    this.connection.sendNotification(note, this.device);
    return next(null, { message: 'sent!' });
  } catch (e) {
    return next(e);
  }
};


ApnService.prototype.getProtocol = function () {
  return this.protocol;
}

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
