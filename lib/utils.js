
/**
 * Pnotifier - Push Notification Services Abstraction
 * 2015 Thomas Bazire <tbazire@evertygo.com>
 * License: MIT
 */

var _ = require('lodash');

module.exports = {

	/**
	 * Provide missing properties from a pool of required ones
	 * @params {object} base, pool of required properties
	 * @params {object} options, properties container to check 
	 */
	missingProperty: function (base, options) {
	  var key = _.partial(_.contains, _.keys(options));
	  return _.filter(base, function (req) {
	    return !key(req);
	  });
	},

	/**
	 * Convert to human-readable, all missing properties usually found
	 * using the function above
	 * @param {object} missing, elements to list
	 * @param {string} prefix, string to prepend to each elements on missing parameter
	 */
	listMissingProperties: function (missing, prefix) {
      var errors = { message: '' };

      if (prefix && typeof prefix === 'string') {
      	missing = missing.map(function (prop) {
      		return prefix + '.' + prop;
      	});
      }
      errors.message = missing.join(', ') + ' is missing.';
      return errors;		
	}
};