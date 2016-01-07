# Pnotifier [![Build Status](https://travis-ci.org/evertygosas/pnotifier.svg?branch=master)](https://travis-ci.org/evertygosas/pnotifier)
Push Notification Services Abstraction

### Example with APN

It works the same for GCM or WNS. You just have to change the structure of the parameters object. And that's it !

```javascript

var Pnotifier = require('pnotifier').Service;

var service = new Pnotifier({
	protocol: 'apn',
	credentials: {
		cert: 'cert_path.pem',
		key: 'key_path.pem'
	},
	options: {
		...
	}
});

service.createConnection(function (err) {

	service.send(['list_of_devices_token','...'],
		{
			alert: 'Hello World!',
			payload: {
				messageFrom: 'Thomas from Evertygo'
			}
		},
		function (err) {
			service.close();
		}
	);
});

```

### APN config structure

All the `options` are the same as the [node-apn](https://github.com/argon/node-apn) package.
But with a particular structure as described below.

``` javascript

var apnConfig = {
	credentials: {
		cert: 'cert_path.pem',
		key: 'key_path.pem',
	},
	options: {
		// node-apn options (except cert, key and token)
	}
};

```

### GCM config structure

All the `options` are the same as the [node-gcm](https://github.com/ToothlessGear/node-gcm) package.
But with a particular structure as described below.

``` javascript

var gcmConfig = {
	credentials: {
		api_key: '...',
	},
	options: {
		// node-gcm options (except api_key and tokens)
	}
};

```


### WNS config structure

All the `options` are the same as the [wns](https://github.com/tjanczuk/wns) package.
But with a particular structure as described below.

``` javascript

var wnsConfig = {
	credentials: {
		client_id: '...',
		client_secret: '...',
		channelURI: '...'
	},
	options: {
		// node-apn options (except client_id, client_secret and channelURI)
	}
};

```

### License
Pnotifier is open-source licensed under the [MIT license](http://opensource.org/licenses/MIT)
