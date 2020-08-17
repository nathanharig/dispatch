const code_translator = require('./common/code_translator');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const _ = require('lodash');
const atob = require('atob');
const moment = require('moment');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';
var twit = require('twit');
var config = require ('./.config.js');
var Twitter = new twit(config);

let sentDispatch = [];
let sentFrees = [];
moment().format();

async function getAlertList() {
	try {
		return new Promise ((resolve, reject) => {

			fs.readFile('credentials.json', async function (err, content) {
				if (err) return console.log('Error loading client secret file:', err);
				// Authorize a client with credentials, then call the Gmail API.
				let x = await authorize(JSON.parse(content), listLabels);
				resolve(x);
			});
		});

	} catch(err) {
		console.log(err);
	}
}

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
async function authorize(credentials, callback) {
	try {
		return new Promise ((resolve, reject) => {

			const {client_secret, client_id, redirect_uris} = credentials.installed;
			const oAuth2Client = new google.auth.OAuth2(
				client_id, client_secret, redirect_uris[0]);

				// Check if we have previously stored a token.
				fs.readFile(TOKEN_PATH, async function (err, token) {
					//	if (err) reject getNewToken(oAuth2Client, callback);
					oAuth2Client.setCredentials(JSON.parse(token));
					let x = await listLabels(oAuth2Client);
					resolve(x);
				});
			});
		}	catch(err) {
			return getNewToken(oAuth2Client, callback);
		}
	}

	/**
	* Get and store new token after prompting for user authorization, and then
	* execute the given callback with the authorized OAuth2 client.
	* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
	* @param {getEventsCallback} callback The callback for the authorized client.
	*/
	function getNewToken(oAuth2Client, callback) {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question('Enter the code from that page here: ', (code) => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
				if (err) return callback(err);
				oAuth2Client.setCredentials(token);
				// Store the token to disk for later program executions
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
					if (err) return console.error(err);
					console.log('Token stored to', TOKEN_PATH);
				});
				callback(oAuth2Client)

			});
		});
	}

	/**
	* Lists the labels in the user's account.
	*
	* @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	*/
	async function listLabels(auth) {
		try {
			return new Promise ((resolve, reject) => {

				const gmail = google.gmail({version: 'v1', auth});
				gmail.users.messages.list({
					auth: auth,
					userId: 'me',
					maxResults: 10,
					q: 'label:Dispatch -AVAILABLE -ROUTINE +MI#',
				}, async function (err, response, callback) {
					if (err) {
						reject(err);
					}
					else {

						var { messages } = response.data;
						let x = await dealWithList(messages, gmail).catch(e => console.log('Error: ', e.message));
						resolve(x);
					}
				});
			});
		} catch(err) {
			console.log(err);
		}
	}

	async function dealWithList(list, gmail) {
		try {
			return new Promise ((resolve, reject) => {
				let arrCheck = [];
				list.map((id) => {
					gmail.users.messages.get({
						'userId': 'me',
						'id': id.id,
						'format': 'full',
					}, (err, response) => {
						if (err) {
							reject(err);
						}
						else {
							//	console.log(`Response- ${response.data.payload.body.data}`);
							let decoded = atob(response.data.payload.body.data);

							// console.log(`Decoded - ${decoded}`);
							if (decoded == '')
							{
								console.log('BLANK');
							}
							//	console.log(response.data.payload.body.data);
							let x =  decoded;
							arrCheck.push(x);
							if (arrCheck.length === list.length) {
								resolve(arrCheck);
							}
						}
					}
				);
			});
		});
	}
	catch (err) {
		console.log(err);
		reject(err);
	}
}

async function formatList(alerts) {
	let dispatches = [];
	let { makeCodes, municipalCodeMaker, unitCodeMaker } = code_translator;
	let testCode = makeCodes();
	let mcdCode = municipalCodeMaker();
	let unitCode = unitCodeMaker();

	function separateByNewLine(i)
	{
		let indexAlarm = i.indexOf('Alarm:');
		let indexLoc = i.indexOf('Loc:');
		let indexX = i.indexOf('X:');
		let indexLatLon = i.indexOf('Lat/Lon:');
		let indexTime = i.indexOf('Time:');
		let indexMI = i.indexOf('MI#:');
		let indexDisp = i.indexOf('Disp:')
		let indexBox = i.indexOf('Box:');
		let cumbIndex = i.indexOf('CUMB');
		let dispatchCodeSlice = i.slice(0, indexAlarm-1);
		let alarmSlice = i.slice(indexAlarm+7, indexLoc-1);
		let addressSlice = i.slice(indexLoc+5, indexX-1);
		let testForCommonLoc = addressSlice.split('@');
		if (testForCommonLoc[1]) {
			addressSlice = testForCommonLoc[0].split(':');
			addressSlice = addressSlice[0];
		}
		let muniSlice = '';
	//	console.log(`Address slice - ${addressSlice}`);

		if (cumbIndex) {
	//		console.log(`cumbIndex - ${cumbIndex} is at ${i[cumbIndex]}`);
			muniSlice = i.slice(cumbIndex-3, cumbIndex+4);
		//	console.log(`Muni slice - ${muniSlice}`);
		}

		else {
			if (addressSlice.includes('YORK')) { muniSlice = ['YC', 'MUTAID']}
			if (addressSlice.includes('ADAM')) { muniSlice = ['AC', 'MUTAID']}
			if (addressSlice.includes('PERR')) { muniSlice = ['PC', 'MUTAID']}
			if (addressSlice.includes('FRAN')) { muniSlice = ['FC', 'MUTAID']}
			if (addressSlice.includes('DAUP')) { muniSlice = ['DC', 'MUTAID']}
		}
	//	console.log(`Muni slice - ${muniSlice}`);
		let addressSliceSplit = addressSlice.split(muniSlice);
		addressSlice = addressSliceSplit[0];
		addressSlice = addressSlice.slice(0, addressSlice.length-1);
		let muniSplit = muniSlice.split(' ');
		let mcdSlice = muniSplit[0];
		let countySlice = muniSplit[1];
	//	console.log(`Muni Split - ${muniSplit}`);
		let crossStreetSlice = i.slice(indexX+3, indexBox-1);
		let crossStreetSplit = crossStreetSlice.split('/');
		let crossStreetOne = crossStreetSplit[0].trim();

		let crossStreetTwo = ''
		if (crossStreetSplit[1]){

			crossStreetTwo= `and ${crossStreetSplit[1].trim()}`;
		}
		if (crossStreetSplit[0] === crossStreetSplit[1]) {
			crossStreetTwo = '';
		}

		let timeSlice = i.slice(indexTime+6, indexMI-1);
		let miSlice = i.slice(indexMI+5, indexDisp-1).trim();
		let unitSlice = i.slice(indexDisp+6, i.length);
		let unitSplit = unitSlice.split(',');
		let unit = unitSplit[0];
		//	console.log(`dispatchCodeSlice- ${dispatchCodeSlice}, alarm- ${alarmSlice}, address- ${addressSlice}, mcd- ${mcdSlice}, county ${countySlice}, cross- ${crossStreetOne} ${crossStreetTwo}, time- ${timeSlice}, incidentNum- ${miSlice}, unit- ${unit}`);

		let separated = {code: dispatchCodeSlice, alarm: alarmSlice, address: addressSlice, mcd: mcdSlice, county: countySlice, cross: `${crossStreetOne} ${crossStreetTwo}`, time: timeSlice, incidentNum: miSlice, unit: unit};
		return separated;
	}

	function addressMinusNumbers(address, code) {
		//console.log(`code- ${code}`);
		if (address.includes('I 81') || /\D/.test(address[0]) || address.includes('I 76') || code.includes('T/A')) {
			//	console.log(`Address- ${address}`);
			return address.trim();
		}
		else {
			let addressArray = address.split(' ');
			let droppedArray = _.drop(addressArray);
			return droppedArray.join(' ').trim();
		}
	}

	function codeMinusClass(code) {
		code = code.trim();
		let newClass = '';
		if (code.includes('CLASS')) {
			let codeSplit = code.split('CLASS');
			code = codeSplit[0].trim();
			newClass = codeSplit[1];
			newClass = newClass.trim();
		}
			let newCode = {code, newClass};
			return newCode;
		}

		function codeTranslate(code, mcd, county, time, cross, address, alarm, unit) {
			let location = addressMinusNumbers(address, code);
			let newCode = codeMinusClass(code);
			let workingCode = newCode.code;
			workingCode = workingCode.toLowerCase();
			//	console.log(workingCode);
			switch(alarm){
				case '1': {
					alarm = ', 1st alarm,';
					break;
				}
				case '2': {
					alarm = ', 2nd alarm,';
					break;
				}
				case '3': {
					alarm = ', 3rd alarm,';
					break;
				}
				case '4': {
					alarm = ', 4th alarm,';
					break;
				}
				default: {
					alarm = '';
				}
			}
			let testClass = newCode.class;
			if (location == '' || location == ' ') {
				location = '';
			}
			else {
				location = `${location},`;
				location = location.trim();
			}
			let messageCode = testCode[workingCode];

			if (!testCode[workingCode]) {
				messageCode = workingCode;
			}
			//console.log(`Message Code - ${messageCode}`);
			if (!messageCode.includes('AED')) {
				messageCode = 'Reported expiration';
			}
			const justMCD = mcd;
			if (messageCode === 'DNS') {
				return 'DNS';
			}
			if (unit === 'PAGERA40' || unit === 'PAGERM40') {
				return 'DNS';
			}
			let message = (`${messageCode}, ${mcdCode[justMCD]}${alarm} ${location} near ${cross} - ${time}`);

			if(testCode[workingCode] && mcdCode[justMCD]) {
				return message;
			}
			else if (messageCode && mcdCode[justMCD]){
				return message;
			}

			else {
				return (`an EMS call - ${time}`)
			}

			/*	if (/\d/.test(code[0]))	{
			tempCode = code.slice(0,2);
			codeWithModifier = code.slice(0,3);
			codeWithModifier = codeWithModifier.split((/(\D)/g), 2);
			switch(tempCode) {
			case '09': {
			if (codeWithModifier[1].includes('A') || codeWithModifier[1].includes('B') || codeWithModifier[1].includes('O'))
			{
			let message = (`reported expiration, ${mcdCode[justMCD]} area of ${location}${cross} - ${time}`);
			return message;
		}
		else {
		if(testCode[tempCode]) {
		let message = (`${testCode[tempCode]}, ${mcdCode[justMCD]} area of ${location}${cross} - ${time}`);
		return message;
	}
	else {
	return ('an emergency call - ' + time);
}
}
break;
}
case '29': {
if(testCode[tempCode]) {
let crashMessage = ((aCode, messageCode) => {
switch(aCode) {
case '29D02m':
return 'Reported pedestrian(s) struck';
break;
case '29D02l':
return 'Reported vehicle/bike/motorcycle crash';
break;
case '29D01h':
return 'Reported vehicle vs a structure crash';
break;
default:
return `${messageCode}`;
}
})(code, testCode[tempCode]);
let message = (`${crashMessage}, ${mcdCode[justMCD]} area of ${location}${cross} - ${time}, expect delays/be alert for responders`);
return message;
}
else {
return ('an emergency call - ' + time + ' expect delays and be alert for responders');
}
break
}
case '20': {
if(testCode[tempCode]) {
let crashMessage = ((aCode, messageCode) => {
switch(aCode[aCode.length-1]) {
case 'C':
return 'Reported hypothermia or cold-related emergency';
break;
case 'H':
return 'Reported hyperthermia or heat-related emergency';
default:
return `${messageCode}`;
}
})(code, testCode[tempCode]);
let message = (`${crashMessage}, ${mcdCode[justMCD]} area of ${location}${cross} - ${time}, expect delays/be alert for responders`);
return message;
}
else {
return ('an emergency call - ' + time + ' expect delays and be alert for responders');
}
break
}
/* case '27':  {
if(testCode[tempCode]) {
let shootingMessage = ((aCode, messageCode) => {
switch(aCode) {
case 'G': return 'Reported patient(s) who have been shot';
break;
case 'S':	return 'Reported patient(s) who have been stabbed)';
break;
default : return `${messageCode}`;
}
})(code[code.length-1], testCode[tempCode]);
let message = (`${shootingMessage}, ${mcdCode[justMCD]} area of ${location}${cross} - ${time}, avoid the area/be alert for responders`);
return message;
}
else {
return ('an emergency call - ' + time + ' expect delays and be alert for responders');
}
break;
}

default: {
if (testCode[tempCode] === 'DNS') {
return 'DNS';
}
let message = (`${testCode[tempCode]}, ${mcdCode[justMCD]} area of ${location}${cross} - ${time}`);
if(testCode[tempCode] && mcdCode[justMCD]) {
return message;
}
else {
return (`an emergency call - ${time}`)
}
}
}
}
else {
let mutaidBool = true;
let checkMUTAID = location.split(' ');
if (checkMUTAID[1] === 'COUNTY') {
mutaidBool = false;
}
if(testCode[code] && mcdCode[justMCD] && testCode[code] != 'MUTAID' && mutaidBool) {
let message = (`${testCode[code]}, ${mcdCode[justMCD]} area of ${location}${cross} at ${time}`);
return message;
}
else if (testCode[code] && mcdCode[justMCD] && code === 'MUTAID') {
let message = (`${testCode[code]} to ${mcdCode[justMCD]} at ${time}`);
return message;
}
else {
return (`an emergency call at ${time}${cross}`)
}
}
*/
}

alerts.map((i) => {
	let {code, alarm, address, mcd, county, cross, time, incidentNum, unit} = separateByNewLine(i);
	let translated = codeTranslate(code, mcd, county, time, cross, address, alarm, unit);
	dispatches.push({incidentNum, code, address, cross, mcd, time, translated, alarm, unit});
});
const uniqueDispatches = dispatches //.filter((object,index) => index === dispatches.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
return {uniqueDispatches};
}

async function mainProgram() {
	console.log(`###### Dispatch program, running at ${new Date().toLocaleString()} ###### \n\n`);
	let x = await getAlertList().catch(e => console.log('Error: ', e.message));
	let formatted = await formatList(x).catch(e => console.log('Error: ', e.message));
//	console.log(formatted);
	formatted.uniqueDispatches.forEach((i) => {
		if (!sentDispatch.includes(`${i.incidentNum}-${i.time}`)) {
			let dispatchMessage = (`${i.incidentNum}: Dispatch- ${i.translated}`);
			if (i.translated !== 'DNS') {

				Twitter.post('statuses/update', {status: dispatchMessage}, function(error, tweet, response) {
					if (error) {
						console.log(`Error- ${error} for ${dispatchMessage}`);
					}
				});



				console.log(`${moment().format('MM/DD HH:mm')} ||-----|| ${dispatchMessage} // ${i.unit}\n\n`);

			}
			else {
				console.log(`${moment().format('MM/DD HH:mm')} NOT SENT||-----|| ${dispatchMessage} ${i.code} ${i.incidentNum} // ${i.unit}\n\n`);

			}

			sentDispatch.push(`${i.incidentNum}-${i.time}`);

		}

	});
	/*
	formatted.frees.forEach((i) => {
	if (!sentFrees.includes(i.index)) {
	let freeMessage = (`${i.message}`);

	/* Twitter.post('statuses/update', {status: freeMessage}, function(error, tweet, response) {
	if (error) {
	console.log(`Error- ${error} for ${freeMessage}`);
}
});

console.log(`${moment().format('MM/DD HH:mm')} ||-----|| ${freeMessage}\n\n`);
sentFrees.push(i.index);
}
});
*/
}

mainProgram();
setInterval(mainProgram, 180000);
