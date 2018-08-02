function makeCodes() {
	let codes = {
		'01': 'Reported medical emergency',//'a reported medical emergency'//'a reported patient with abdominal pain',
		'02': 'Reported medical emergency',//'a reported allergic reaction',
		'03': 'Reported injury',//'a reported animal bite',
		'04': 'Reported assault',//'a reported assault',
		'05': 'RReported medical emergency',//'a reported patient with back pain',
		'06': 'Reported medical emergency',//'a reported patient with difficulty breathing',
		'07': 'Reported injury due to burns or explosions',
		'08': 'Reported HAZMAT or CO incident',
		'09': 'Reported patient in cardiac arrest',
		'10': 'Reported medical emergency',//'a reported chest pain patient',
		'11': 'Reported choking patient',
		'12': 'Reported medical emergency',//'a reported seizure patient',
		'13': 'Reported medical emergency',//'a reported diabetic emergency',
		'14': 'Reported water-related emergency',
		'15': 'Reported injury',//'a reported electrical injury',
		'16': 'Reported injury',//'a reported eye injury',
		'17': 'Reported injury',//'a reported fall victim',
		'18': 'Reported medical emergency',//'a reported headache',
		'19': 'Reported medical emergency',//'a reported cardiac problem',
		'20': 'Reported environmental emergency',
		'21': 'Reported patient who may be bleeding',
		'22': 'Reported non-vehicle rescue',
		'23': 'Reported overdose',
		'24': 'Reported medical emergency',//'a reported obstetrical emergency',
		'25': 'Reported behavioral emergency',//'a reported behavioral emergency',
		'26': 'Reported medical emergency',//'a reported sick person',
		'27': 'Reported injury due to a weapon',
		'28': 'Reported medical emergency',//'a reported stroke',
		'29': 'Reported vehicle crash',
		'30': 'Reported injury',
		'31': 'Reported medical emergency',//'a reported unconscious person',
		'32': 'An unknown problem',
		'33': 'Reported need for transportation',
		'FAFA': 'Reported automatic fire alarm',
		'FAFARD': 'Reported automatic fire alarm',
		'FAIRCR': 'Reported aircraft fire',
		'FBARN1': 'Fire call',
		'FBARN2': 'Fire call',
		'FBARN3': 'Fire call',
		'FBARN4': 'Fire call',
		'FCB': 'Reported controlled burn',
		'FCODET': 'Reported CO detector activation',
		'FHMINI': 'Reported HAZMAT',
		'FHMNS': 'Reported HAZMAT',
		'FHMOUI': 'Reported HAZMAT',
		'FHMSTR': 'Reported HAZMAT',
		'FLZ': 'Assist at a helicopter landing zone',
		'FMA': 'Assist with a fire department medical assist',
		'FMASTN': 'Reported mass transportation emergency',
		'FMISC': 'Fire call',
		'FOTRES': 'Fire call',
		'FOUI': 'Fire call',
		'F1ST': 'Fire call',
		'F2ND': 'Fire call',
		'F3RD': 'Fire call',
		'F4TH': 'Fire call',
		'FSTR1':'Fire call',
		'FSTR2': 'Fire call',
		'FSTR3': 'Fire call',
		'FSTR4': 'Fire call',
		'FVEHICLE': 'Vehicle fire',
		'FVEHLG': 'Vehicle fire',
		'FVEHSM': 'Vehicle fire',
		'FVSNI': 'Reported vehicle vs a structure',
		'FWARES': 'Reported water rescue',
		'FWF': 'Fire call',
		'FWFSTR': 'Fire call',
		'FWFVEH': 'Fire call',
		'FXFER1': 'on a transfer',
		'FXFER2': 'on a transfer',
		'FXFER3': 'on a transfer',
		'FXFER4': 'on a transfer',
		'MUTAID': 'Mutual aid',
		'XFER': 'on a transfer',
		'PAANI': 'Vehicle crash',
		'EREF': 'assist another emergency unit',
		'EROUT': 'Standby services'
	};
	return codes;
}

function municipalCodeMaker(){
	let codes = {
		'CB':	'Carlisle Barracks',
		'HW':	'Hopewell Township',
		'NB':	'Borough of Newburg',
		'ST':	'Shippensburg Township',
		'SB':	'Borough of Shippensburg',
		'SF':	'Borough of Shippensburg',
		'SH':	'Southampton Township',
		'UM':	'Upper Mifflin Township',
		'NN':	'North Newton Township',
		'NW':	'Borough of Newville',
		'SN':	'South Newton Township',
		'UF':	'Upper Frankford Township',
		'WP':	'West Pennsboro Township',
		'PN':	'Penn Township',
		'CK':	'Cooke Township',
		'DK':	'Dickinson Township',
		'LF':	'Lower Frankford Township',
		'NM':	'North Middleton Township',
		'CA':	'Borough of Carlisle',
		'SM':	'South Middleton Township',
		'MH':	'Borough of Mt. Holly',
		'MX':	'Middlesex Township',
		'MN':	'Monroe Township',
		'SS':	'Silver Spring Township',
		'MB':	'Borough of Mechanicsburg',
		'HM':	'Hampden Township',
		'NV':	'Naval Support Activity',
		'UA':	'Upper Allen Township',
		'SR':	'Borough of Shiremanstown',
		'LA':	'Lower Allen Township',
		'EP':	'East Pennsboro Township',
		'WB':	'Borough of Wormleysburg',
		'CH':	'Borough of Camp Hill',
		'LB':	'Borough of Lemoyne',
		'NC':	'New Cumberland Boro',
		'HC':	'Huntingdon County',
		'MF':	'Mifflin County',
		'JC':	'Juniata County',
		'PC':	'Perry County',
		'AC':	'Adams County',
		'YC':	'York County',
		'LN':	'Lancaster County',
		'DC':	'Dauphin County',
		'LE':	'Lebanon County'
	}
	return codes;

}

function unitCodeMaker () {
	let codes = {
		'MU140M': 'MICU 140',
		'MU240M': 'MICU 240',
		'MU340M': 'MICU 340',
		'MU440M': 'MICU 440',
		'MU540M': 'MICU 540',
		'MU640M': 'MICU 640',
		'MU740M': 'MICU 740',
		'MU840M': 'MICU 840',
		'MU940M': 'MICU 940',
		'MU1040M': 'MICU 1040',
		'A140': 'Ambulance 140',
		'A240': 'Ambulance 240',
		'A340': 'Ambulance 340',
		'A440': 'Ambulance 440',
		'A540': 'Ambulance 540',
		'A640': 'Ambulance 640',
		'A740': 'Ambulance 740',
		'A840': 'Ambulance 840',
		'A940': 'Ambulance 940',
		'A1040': 'Ambulance 1040',
		'M140': 'Medic 140',
		'M240': 'Medic 240',
		'M340': 'Medic 340',
		'REHAB40': 'Rehab 40',
		'QRS40': 'QRS 40',
		'BAR40': 'Bariatric 40',
	}
	return codes;
}
module.exports.municipalCodeMaker = municipalCodeMaker;
module.exports.makeCodes = makeCodes;
module.exports.unitCodeMaker = unitCodeMaker;
