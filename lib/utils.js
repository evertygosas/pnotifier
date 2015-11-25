
var _ = require('lodash');

module.exports = {

	missingProperty: function (base, options) {
	  var key = _.partial(_.contains, _.keys(options));
	  return _.filter(base, function (req) {
	    return !key(req);
	  });
	}
};