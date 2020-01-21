// Utilities
require('dotenv').config();
const axios = require('axios');
axios.defaults.baseURL = process.env.TAGGER_SERVICE;

const readTags = (res, deviceId) => {
	registry.getTwin(deviceId, function(err, twin) {
		if (err) {
			res.render('error', {
				header: 'ERROR READING TWIN TAGS',
				message: err.name,
			});
		} else {
			console.log(twin.tags);
			let lu = twin.tags.subscriptionTraffic.lastLu;
			delete lu['status'];
			delete lu['gprsStatus'];
			let gprs = twin.tags.subscriptionTraffic.gprs;
			delete twin.tags.subscriptionTraffic['lastLu'];
			delete twin.tags.subscriptionTraffic['gprs'];

			let data = {
				sm: twin.tags.subscriptionData,
				st: twin.tags.subscriptionTraffic,
				lastLu: lu,
				gprs: gprs,
			};
			res.render('twindata', data);
		}
	});
};

// IoT HUB
var Registry = require('azure-iothub').Registry;
var connectionString = process.env.CONNECTION_STRING;
var registry = Registry.fromConnectionString(connectionString);

// APP
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');
});

router.get('/tags', function (req, res, next) {
	res.render('tags');
});

router.get('/imsi', function (req, res, next) {
	res.render('imsi');

});

router.post('/device', function (req, res, next) {
	let deviceId = req.body.deviceId;
	let url = '/device/' + deviceId;
	console.log('ENDPOINT for API: ' + axios.defaults.baseURL + url);

	let data = {
		imsi: req.body.imsi,
		type: req.body.type
	};

	let options = {
		url: url,
		method: 'post',
		timeout: 10000,
		data
	};

	axios
		.request(options)
		.then(function (response) {
			res.render('imsi', {
				status: `SUCCESSFULLY SET CLOUD PROPERTIES OF [${deviceId}]`,
			});
		})
		.catch(function (error) {
			res.render('error', {
				header: 'ERROR SETTING CLOUD PROPERTIES',
				message: error.response.status + ': ' + error.response.data,
			});
		});
});

router.get('/twin', function (req, res, next) {
	readTags(res, req.query.deviceId);
});


router.post('/tags', function (req, res, next) {
	let deviceId = req.body.deviceId;
	let url = '/tags/' + deviceId;
	console.log('ENDPOINT for API: ' + axios.defaults.baseURL + url);


	let options = {
		url: url,
		method: 'post',
		timeout: 10000
	};

	axios
		.request(options)
		.then(function (response) {
			res.render('tags', {
				status: `SUCCESSFULLY SET CLOUD PROPERTIES OF [${deviceId}]`,
			});
		})
		.catch(function (error) {
			res.render('error', {
				header: 'ERROR SETTING CLOUD PROPERTIES',
				message: error.response.status + ': ' + error.response.data,
			});
		});});

module.exports = router;

/*

	*/