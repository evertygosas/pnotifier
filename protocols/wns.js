
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var wns = require('wns');
var _ = require('lodash');
var sysu = require('util');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var utils = require('../lib/utils');

/**
 * Initialize 
 * @param {object} params, service parameters
 * @param {object} emitter, EventEmitter (not used yet)
 */
var WnsService = function (params) {
  EventEmitter.call(this);

  this.protocol = 'wns';
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {};
  this.tokens = [];
};

sysu.inherits(WnsService, EventEmitter);

/**
 * Check all required parameters for the Windows Notification Service.
 * @param {function} next
 */
WnsService.prototype.createConnection = function (next) {

  var required = ['client_id','client_secret'];
  // Check missing parameters
  var missing = utils.missingProperty(required, this.credentials);

  if (!_.isEmpty(missing)) {
    return next(utils.listMissingProperties(missing, 'credentials'));
  }
  return next(null);
};

/**
 * Send a notification to the Windows Notification Service.
 * @param {object} data, data to send
 * @param {function} next
 */
WnsService.prototype.send = function (tokens, data, next) {

  var required = ['type','payload'];
  var validTypes = ['toast', 'badge', 'raw', 'tile'];

  try {

    this.tokens = typeof tokens === 'object' ? tokens : [];

    var missing = utils.missingProperty(required, data);

    if (!_.isEmpty(missing)) {
      return next(utils.listMissingProperties(missing));
    }

    if (!_.includes(validTypes, data.type))
      return next({message: 'Invalid type ' + data.type + '.' });

    _.merge(this.options, this.credentials);

    var options = this.options;

    async.each(this.tokens, function (token, done) {

      wns.send(token, data.payload, 'wns/' + data.type, options,
        function (err, response) {
          if (err) return done(err);
          done(null, response);
        }
      );
   
    }, function (err, info) {
      return next(err, info);
    });

  } catch (e) {
    return next(e);
  }

};

/**
 * Provide protocol (service name)
 */
WnsService.prototype.getProtocol = function () {
  return this.protocol;
}

/**
 * Do nothing except executing the given callback.
 * @param {function} next, callback
 */
WnsService.prototype.close = function (next) {
  if (next) return next();
};

/**
 * Exporting the module
 */
module.exports = WnsService;
