
var _ = require('lodash');

module.exports = {

	missingProperty: function (base, options) {
	  var key = _.partial(_.contains, _.keys(options));
	  return _.filter(base, function (req) {
	    return !key(req);
	  });
	},

	listMissingProperties: function (missing, prefix) {
      var errors = { message: '' };

      if (prefix) {
      	missing = missing.map(function (prop) {
      		return prefix + '.' + prop;
      	});
      }
      errors.message = missing.join(', ') + ' is missing.';
      return errors;		
	}
};