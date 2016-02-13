var mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect('mongodb://localhost/indoornavigation');

db.on('error', console.error);
db.once('open', function() {
  console.log("Mongo connection successful ");
});

var signal = new mongoose.Schema({
id: String,
aps: [{
	SSID: String,
	BSSID: String,
	level: Number,
	frequency: Number,
	channelWidth: Number,
	centerFreq0: Number,
	centerFreq1: Number,
	distanceCm: Number,
	distanceSdCm: Number,
}],
locationName: String});


module.exports = mongoose.model('Signal', signal);
