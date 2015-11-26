
/**
 * Pnotifier -
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

'use strict';

var wns = require('wns');
var _ = require('lodash');
var utils = require('../lib/utils');

var WnsService = function (params, emitter) {
  this.protocol = 'wns';
  this.emitter = emitter;
  this.params = params || {};
  this.options = this.params.options || {};
  this.credentials = this.params.credentials || {}; 
};

WnsService.prototype.createConnection = function (next) {

  var required = ['client_id','client_secret','channelURI'];
  // Check missing parameters
  var missing = utils.missingProperty(required, this.credentials);

  if (!_.isEmpty(missing)) {
    return next(utils.listMissingProperties(missing, 'credentials'));
  }

};

WnsService.prototype.send = function (data, next) {

  var required = ['type','payload'];

  try {

    var missing = utils.missingProperty(required, data);

    if (!_.isEmpty(missing)) {
      return next(utils.listMissingProperties(missing));
    }

    _.merge(this.options, this.credentials);

    wns.send(
      this.options.channelURI,
      data.payload,
      'wns/' + data.type,
      this.options,
      function (err, response) {
        if (err) return next(err);
        next(null, response);
      }
    );
  } catch (e) {
    return next(e);
  }

};


WnsService.prototype.getProtocol = function () {
  return this.protocol;
}


WnsService.prototype.close = function (next) {
  next();
};

module.exports = WnsService;