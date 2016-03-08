var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = 9090;
var Signal = require('./signal');
var jsonfile = require('jsonfile');
var mkdirp = require('mkdirp');
var PythonShell = require('python-shell');
var signalsArray = [];

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.post('/api/signals', function(req, res) {
	populateSignalsArray(req.body.aps);
	dumpIntoMongo(req.body);	
	res.send('Dumped');
});

var populateSignalsArray = function(aps) {
	var locationSpecificParsedSignals = getLocationSpecificParsedSignals(aps);
	signalsArray.push(locationSpecificParsedSignals);
};

var dumpIntoMongo = function(signalBody) {
	var signal = new Signal(signalBody);
	signal.save(function(err) {
		if(err) {
			console.log(err);
		}
	});
};

var getLocationSpecificParsedSignals = function(aps) {
	var parsedSignalArray = [];
	aps.forEach(function(ap) {
		parsedSignalArray.push({BSSID: ap.BSSID, level: ap.level});
	});
	return parsedSignalArray;
};

app.post('/api/collectSignals', function(req, res) {
	var locationName = req.body.locationName;
	var directory = "signal_data_sets/" + locationName; 
	mkdirp(directory, function(err) {
		if(err) {
			console.log(err);
		}
		var filePath = directory + '/' + makeRandomString();

		//**********************To collect filtered fields of the wifi signal object in the signal_data_sets folder************
		jsonfile.writeFile(filePath, signalsArray, function(err) {
			console.log("in file create success");
			res.send("Successfully created " + filePath);
			signalsArray = [];
		});
		//*********************************************************************************************************************

		// *********************To collect the whole wifi signal object in the signal_data_sets folder************************* 
		//Signal.find({"locationName": locationName}).exec(function(error, signals) {
		//	jsonfile.writeFile(filePath, signals, function(err) {
		//		console.log("in file create success");
		//		res.send("Successfully created " + filePath);
		//	});
		//});
		//*********************************************************************************************************************
	});	
});

var makeRandomString = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.get('/api/fetchCurrentLocation', function(req, res) {
	var pyshell = new PythonShell('trial_svm.py');
	var location = "";
	pyshell.send(req.query.currentSignal);	
	pyshell.on('message', function (message) {
		location = message;
	});

	pyshell.end(function (err) {
  		if (err) throw err;
  		console.log('finished');
  		console.log('location:', location);
		res.json(location);
	});
});

app.get('/', function(req, res) {
	console.log("in get");
	res.send("Hey");
});
app.listen(port);
