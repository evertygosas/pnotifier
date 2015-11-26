
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var wns = require('wns');
var _ = require('lodash');

var WnsService = function (emitter, params) {
  this.emitter = emitter;
  this.params  = params || {};
  this.options = this.params.options || {}; 
};

WnsService.prototype.createConnection = function (next) {

  var required = ['client_id','client_secret','channelURI'];
  // Check missing parameters
  var missing = utils.missingProperty(required, this.params);

  if (!_.isEmpty(missing)) {
    missing.forEach(function (prop) {
      this.emitter.emit('error', prop + ' is missing.');
    });
  }

};

WnsService.prototype.send = function (data, next) {

  var required = ['type','payload'];

  try {

    var missing = utils.missingProperty(required, data);

    if (!_.isEmpty(missing)) {
      missing.forEach(function (prop) {
        this.emitter.emit('error', prop + ' is missing.');
      });
    }

    wns.send(
      this.params.channelURI,
      data.payload,
      'wns/' + data.type,
      this.options,
      function (err, response) {
        if (err) throw err;
        next(null, response);
      }
    );
  } catch (e) {
    next(e);
  }

};


WnsService.prototype.close = function (next) {
  next();
};

module.exports = WnsService;