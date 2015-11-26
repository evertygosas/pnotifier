# Pnotifier
<br>
[![Build Status](https://travis-ci.org/evertygosas/pnotifier.svg?branch=master)](https://travis-ci.org/evertygosas/pnotifier)

## WARNING:
- Not working for now.

### APN usage:

It works the same for GCM or WNS. You just have to change the structure of the parameters object. And that's it !

```javascript

var Pnotifier = require('pnotifier');

var service = new Pnotifier({
	protocol: 'apn',
	token: ['...','...']
	options: {
		cert: 'cert_path.pem',
		key: 'key_path.pem'
	}
});

service.createConnection(function (err) {

	service.send(
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
