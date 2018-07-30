//const get_alert = require('./common/get_alert');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const _ = require('lodash');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

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
					q: 'label:Dispatch',
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
							let x = response.data.snippet;
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

async function checkCodes(alerts) {
	let dispatches = [];
	let frees = [];
	alerts.map((i) => {
		if(i.includes('Lat/Lon') && !dispatches.includes(i)) {
			dispatches.push(i);
		}
		else if (!i.includes('Lat/Lon')) {
			let x = i.indexOf('MI#:');
			let it = i.slice(0, x+13);
			let miSlice = i.slice(x, x+13);
			let enrouteIndex = i.indexOf('Enr#:')
			let enrouteSlice = i.slice(enrouteIndex + 5, enrouteIndex + 6)
			console.log(frees.includes(miSlice));
			if (!frees.includes(miSlice) &&  enrouteSlice.match(/\d/)) {
			frees.push(i);
		}
		}
	});
	console.log(`Dispatches = ${dispatches} \n \n \nFrees = ${frees}`);
}

async function mainProgram() {
	let x = await getAlertList();
	checkCodes(x);
}

mainProgram();
setInterval(mainProgram, 150000);
