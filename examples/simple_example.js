var Pnotifier = require('pnotifier').Service;

var service = new Pnotifier({
	protocol: 'apn',
	credentials: {
		cert: 'sample-cert.pem', // Certificate path
		key: 'sample-key.pem',	 // Key path
		token: '...'		 // Phone token
	}
});

service.createConnection(function (err, res) {

	// Do some checks with `err` variable

	var msg = {
		alert: 'Hello World!' // Content of the notification
	};

	service.send(msg, function (err, res) {
	
		service.close(function () {
			console.log("Sent!");
		});
	});
});
