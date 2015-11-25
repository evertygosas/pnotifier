
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var wns = require('wns');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

/**
 * Required params:
 * - client_id
 * - client_secret
 * - channelURI
 * - type
 * - payload
 */


var WnsService = function (params) {
  this.params  = params || {};
  this.options = this.params.options || {}; 
};

WnsService.prototype.createConnection = function (next) {

  // Check missing parameters

};

WnsService.prototype.send = function (data, next) {

  try {

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