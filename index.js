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
					maxResults: 2,
					q: 'label:Dispatch -PAGERA40 -PAGERM40',
				}, async function (err, response, callback) {
					if (err) {
						reject(err);
					}
					else {

						var { messages } = response.data;
						let x = await dealWithList(messages, gmail);
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
							let decoded = atob(response.data.payload.body.data)
							//console.log(decoded);
							//console.log(response.data.payload.body.data);
							let x = decoded;
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
	}
}

async function formatList(alerts) {
	let dispatches = [];
	let frees = [];
	let { makeCodes, municipalCodeMaker, unitCodeMaker } = code_translator;
	let testCode = makeCodes();
	let mcdCode = municipalCodeMaker();
	let unitCode = unitCodeMaker();

	function separateByNewLine(i)
	{
		let separated = i.split('\r\n');
		return separated;
	}

	function getIncidentNumber(i) {
		let x = i.indexOf('MI#:');
		let incidentNumber = i.slice(x+4, x+13);
		return incidentNumber;
	}

	function checkEnroute(i) {
		let enrouteIndex = i.indexOf('Enr#:');
		let enrouteSlice = i.slice(enrouteIndex + 5, enrouteIndex + 6);
		if (enrouteSlice.match(/\d/)) {
			return true;
		}
		else {
			return false;
		}
	}

	function getDispatchCode(i) {
		let code = i.split(' ', 1)
		return code[0];
	}

	function addressFromDispatch(separated){
		let addressLine = separated[1];
		let semicolonIndex = separated[1].indexOf(';');
		let addressSlice = separated[1].slice(0, semicolonIndex);
		let splitComma = addressSlice.split(',', 2);

		return {addressSlice: splitComma[0], split: splitComma[1]};
	}

	function addressFromFree(separated){
		let addressLine = separated[0];
		let semicolonIndex = separated[0].indexOf(';');
		let addressSlice = separated[0].slice(0, semicolonIndex);
		let splitComma = addressSlice.split(',', 2);
		return {addressSlice: splitComma[0], split: splitComma[1]};
	}

	function crossStreet(separated) {
		let crossStreetLine = separated[3];
		let colonIndex = separated[3].indexOf(':');
		let crossStreetSliceOne = separated[3].slice(colonIndex + 1);
		if (crossStreetSliceOne.indexOf('/') === crossStreetSliceOne.length - 2) {
			let crossStreetSliceTwo = crossStreetSliceOne.slice(0, crossStreetSliceOne.indexOf('/'));
			return crossStreetSliceTwo
		}
		else {
			return crossStreetSliceOne;
		}
	}

	function dispatchTime(separated) {
		let timeLine = separated[6];
		let timeSlice = timeLine.slice(5)
		let timeSplit = timeSlice.split(' ', 2);
		return (moment(timeSlice, 'YYYY-MM-DD HH:mm:ss').format("M/D/YY h:mma"))
	}

	function addressMinusNumbers(address, code){
		let codeSlice = code.slice(0,2);
			if (address.includes('I 81') || address.includes('COUNTY') || /\D/.test(address[0]) || address.includes('I 76') || codeSlice === '29' || /\D/.test(code[0]) && code[0] != "E" ){
				return address.trim();
			}
			else {
				let addressArray = address.split(' ');
				let droppedArray = _.drop(addressArray);
				return droppedArray.join(' ').trim();
			}
		}

	function codeTranslate(code, muncipalCode, time, cross, address) {
		let location = addressMinusNumbers(address, code);
		if (/\d/.test(address[0]) && cross && cross != ' ') {
			cross = ` near ${cross}`;
		}
		else {
			cross = '';
		}

		const justMCD = muncipalCode.slice(0,2);

		if (/\d/.test(code[0]))	{
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
				case '27':  {
					if(testCode[tempCode]) {
					let shootingMessage = ((aCode, messageCode) => {
							switch(aCode) {
							case 'G': return 'Reported gunshot pt(s)';
							break;
							case 'S':	return 'Reported stabbing pt(s)';
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
	}

	function freesMessage(separated, address, incidentNumber, municipalCode, unit) {
		const justMCD = municipalCode.slice(0,2);
		let code = '99';
		let time = separated[7];
		time = time.slice(5);
		let arrHos = separated[6];
		let timeMessage = `at ${moment(time, 'HH:mm:ss').format("h:mma")}`
		let location = addressMinusNumbers(address, code);
		let checkMUTAID = location.split(' ');
		let endMessage = 'Caution- other responders may still be in the area.';
		if (checkMUTAID[1] === 'COUNTY') {
			location = 'mutual aid';
			endMessage = '';
		}
		switch (/\d/.test(arrHos[10])) {
		case false: {
			let message = `Update: ${incidentNumber} - ${unit} cleared: ${mcdCode[justMCD]}, ${location} ${timeMessage}. ${endMessage}`;
			return message;
			}
		default: {
			let message = `Update: ${incidentNumber} - ${unit} cleared, pt(s) transported: ${mcdCode[justMCD]}, ${location} ${timeMessage}. ${endMessage}`;
			return message;
		}
		}
	}

	function getFreeUnit(separated) {
		let unit = (separated[8].slice(5));
		switch(unit.charAt(unit.length - 1)) {
			case 'M' :  {
				return (unitCode[unit]);
				break
			}
			case 'A' :  {
				return false;
				break
			}
			default: {
				if (unitCode[unit]) {
					return (unitCode[unit]);
				}
				else {
					return 'We';
				}
			}
		}
		return 'test';
	}

	alerts.map((i) => {
		if(i.includes('Lat/Lon')) {
			let separated = separateByNewLine(i);
			let incidentNumber = getIncidentNumber(i);
			let code = getDispatchCode(i);
			let tempAddress = addressFromDispatch(separated)
			let address = tempAddress.addressSlice;
			let municipalCode = tempAddress.split;
			let cross = crossStreet(separated);
			let time = dispatchTime(separated);
			let translated = codeTranslate(code, municipalCode, time, cross, address);
			dispatches.push({incidentNumber, code, address, cross, municipalCode, time, translated});
		}
		else if (!i.includes('Lat/Lon')) {
			let separated = separateByNewLine(i);
			let incidentNumber = getIncidentNumber(i);
			let enrouteSlice = checkEnroute(i);
			let tempAddress = addressFromFree(separated)
			let address = tempAddress.addressSlice;
			let municipalCode = tempAddress.split;
			let unit = getFreeUnit(separated);
			let message = freesMessage(separated, address, incidentNumber, municipalCode, unit);
			if (enrouteSlice && unit) {
				frees.push({ index: `${incidentNumber} - ${unit}`, address, municipalCode, message, unit});
			}
		}
	});
	const uniqueDispatches = dispatches.filter((object,index) => index === dispatches.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
	const uniqueFrees = frees.filter((object,index) => index === frees.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
	return {uniqueDispatches, frees};
}

async function mainProgram() {
	//console.log(`###### Dispatch program, running at ${new Date().toLocaleString()} ###### \n\n`);
	let x = await getAlertList();
	let formatted = await formatList(x);
	formatted.uniqueDispatches.forEach((i) => {
		if (!sentDispatch.includes(i.incidentNumber)) {
			let dispatchMessage = (`${i.incidentNumber}: Dispatch- ${i.translated}`);
			Twitter.post('statuses/update', {status: dispatchMessage}, function(error, tweet, response) {
  		if (error) {
    	console.log(`Error- ${error} for ${dispatchMessage}`);
  		}
});
			console.log(`${moment().format('MM/DD HH:mm')} ||-----|| ${dispatchMessage}\n\n`);
			sentDispatch.push(i.incidentNumber);
		}

	});
	formatted.frees.forEach((i) => {
		if (!sentFrees.includes(i.index)) {
			let freeMessage = (`${i.message}`);
			Twitter.post('statuses/update', {status: freeMessage}, function(error, tweet, response) {
  		if (error) {
    	console.log(`Error- ${error} for ${freeMessage}`);
  		}
			console.log(`${moment().format('MM/DD HH:mm')} ||-----|| ${freeMessage}\n\n`);
			sentFrees.push(i.index);
		}
	});

}

mainProgram();
setInterval(mainProgram, 180000);
