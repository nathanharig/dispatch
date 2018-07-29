const access_token = require('./access_token');
const code_translator = require('./code_translator');
const _ = require('lodash');
var axios = require('axios');
let mostRecent = 0;
let { makeCodes } = code_translator;
let codeObjects = makeCodes();


function getAlertList() {
 /* Implementation using Active911
//	console.log(`\n### ${access_token} ### \n`);
	if (access_token) {
//		console.log(`Most recent id is = ${mostRecent}`);
		axios.defaults.headers.common['Authorization'] = "Bearer " + access_token;
		axios.get('https://access.active911.com/interface/open_api/api/alerts/', {
			alert_days: 1,
		})
		.then(response => {
			const { id } = response.data.message.alerts[0];
	//		console.log(`id = ${id} \n`);
			if (id && id != mostRecent) {
				mostRecent = id;
				getSingleAlert(id);
			}
		})
		.catch(error => {
			console.log(error);
		});



	};
	
};

var getSingleAlert = function(passedId) {
//	console.log(`here with ${passedId} \n`)
	axios.get(`https://access.active911.com/interface/open_api/api/alerts/${passedId}`)
	.then(response => {
		//console.log(`Alert Response = ${_.keysIn(response.data.message.alert)}`);
		const { id, cross_street, cad_code, city, description, address, details } = response.data.message.alert;
		var str = description
		var splitted = str.split(' -', 1);
		if (address.includes('I 76') || address.includes('I 81')) {
			var addressSplit = address.split('  ', 2);
			tempAddress = `${addressSplit[0]} ${addressSplit[1]}`;
			addressSplit = tempAddress.split(' ', 4)
			addressSplit = `${addressSplit[0]} ${addressSplit[1]}${addressSplit[2]} ${addressSplit[3]}`;
		}
		else {
		var addressSplit = address.replace(/[0-9]/g, '');
		}
		var phrase = `Inc# ${cad_code} -- Report of ${splitted} -- ${addressSplit} near ${cross_street} in ${city}`;
		console.log(phrase);
		var codeIndex = details.indexOf('CODE: ');
		var codeSlice = details.slice(codeIndex + 6, codeIndex + 12);
		console.log(`${codeSlice}`);
		var firstTwoCode = codeSlice.slice(0, 2);
		console.log(`first two code ${firstTwoCode}`);
		console.log(codeObjects[firstTwoCode]);
	})
	.catch(error => {
		console.log(error);
	});
};

module.exports.getAlertList = getAlertList;
