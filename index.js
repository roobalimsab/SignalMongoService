var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = 9090;
var Signal = require('./signal');
var jsonfile = require('jsonfile');
var mkdirp = require('mkdirp');
var PythonShell = require('python-shell');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.post('/api/signals', function(req, res) {
	var signal = new Signal(req.body);
	signal.save(function(err) {
		if(err) {
			res.send(err);
		}
	});
	res.json(signal);
});

app.post('/api/collectSignals', function(req, res) {
	var locationName = req.body.locationName;
	var directory = "signal_data_sets/" + locationName; 
	mkdirp(directory, function(err) {
		if(err) {
			console.log(err);
		}
		var filePath = directory + '/' + makeRandomString();
		Signal.find({"locationName": locationName}).exec(function(error, signals) {
			jsonfile.writeFile(filePath, signals, function(err) {
				console.log("in file create success");
				res.send("Successfully created " + filePath);
			});
		});
	});	
});

var makeRandomString = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.post('/api/fetchCurrentLocation', function(req, res) {
	var location = "";
	var pyshell = new PythonShell('trial_svm.py');
	var signalArray = req.body;
	signalArray.forEach(function(signal) {
		pyshell.send(signal);
	});
	pyshell.on('message', function (message) {
		location = message;
	});

	pyshell.end(function (err) {
  		if (err) throw err;
  		console.log('finished');
		console.log("lcoation", location);
		res.json(location);
	});
});

app.get('/', function(req, res) {
	console.log("in get");
	res.send("Hey");
});
app.listen(port);
