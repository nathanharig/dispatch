function makeCodes() {
	let codes = {
		'abdominal pain': 'DNS',//'a reported medical emergency'//'a reported patient with abdominal pain',
		'allergic reaction': 'DNS',//'a reported allergic reaction',
		'animal bite': 'Reported animal bite',
		'assault victim': 'DNS',//'a reported assault',
		'back pain': 'DNS',//'a reported patient with back pain',
		'breathing problem': 'DNS',//'a reported patient with difficulty breathing',
		'burns': 'Reported injury involving a burn or explosion ',
		'co problem': 'Reported HAZMAT or CO incident',
		'cardiac arrest aed': 'Reported patient in cardiac arrest',
		'chest pain': 'DNS',//'a reported chest pain patient',
		'choking': 'Reported choking patient',
		'seizures': 'DNS',//'a reported seizure patient',
		'diabetic': 'DNS',//'a reported diabetic emergency',
		'drowning/diving': 'Reported patient with a drowning or diving emergency',
		'electrocution': 'Reported electrocution or lightning strike',
		'eye injury': 'DNS',//'a reported eye injury',
		'fall victim': 'DNS',//'a reported fall victim',
		'headache': 'DNS',//'a reported headache',
		'heart problem': 'DNS',//'a reported cardiac problem',
		'exposure': 'Reported environmental emergency',
		'hemorrhage': 'DNS',
		'inaccessible/entrapment': 'Reported non-vehicle rescue',
		'od/poisoning': 'DNS',
		'obstectrics': 'DNS',//'a reported obstetrical emergency',
		'psych patient': 'DNS',//'a reported behavioral emergency',
		'sick person': 'DNS',//'a reported sick person',
		'stabbing/gunshot': 'DNS',
		'shooting': 'DNS',
		'stabbing': 'DNS',
		'stroke': 'DNS',//'a reported stroke',
		'cva': 'DNS',//'a reported stroke',
		'obvious/expected death': 'DNS',
		'traffic / transportation incidents': 'Reported vehicle crash',
		'traffic accident': 'Reported vehicle crash',
		't/a': 'Reported vehicle crash',
		'traumatic injury': 'Reported injury',
		'unconscious person': 'DNS',//'a reported unconscious person',
		'unknown conditions': 'An unknown problem',
		'inter-facility transfer': 'Reported need for transportation only',
		'alarm residential': 'Reported automatic fire alarm',
		'alarm commercial/high life': 'Reported automatic fire alarm',
		'alarm co/gas': 'Reported carbon monoxide/gas alarm',
		'alarm elevator': 'Reported elevator alarm',
		'structure fire residential' : 'Reported structure fire',
		'structure fire commercial' : 'Reported structure fire',
		'structure fire high life' : 'Reported structure fire',
		'structure fire mobile home' : 'Reported structure fire',
		'structure fire non-dwelling small' : 'Reported structure fire',
		'structure fire non-dwelling large' : 'Reported structure fire',
		'structure fire small other' : 'Reported structure fire',
		'structure fire hazmat' : 'Reported structure fire with hazmat',
		'structure fire gas leak' : 'Reported gas leak',
		'structure fire chimney fire' : 'Reported chimney fire',
		'structure fire chimney' : 'Reported chimney fire',
		'structure fire investigation' : 'Reported fire dept. investigation inside',
		'structure gas leak' : 'Reported gas leak',
		'structure chimney fire' : 'Reported chimney fire',
		'structure investigation' : 'Reported fire dept. investigation inside',
		'explosions building' : 'Reported explosions in a buiilding',
		'explosions outside' : 'Reported explosions outside',
		'vehicle fire large' : 'Reported large vehicle on fire',
		'vehicle fire small' : 'Reported vehicle on fire',
		'aircraft incident' : 'Reported incident involving an aircraft',
		'unk injuries' : 'Reported vehicle crash',
		'injuries' : 'Reported vehicle crash',
		'pedestrian struck' : 'Reported pedestrian struck',
		't/a entrapment/high mechanism' : 'Reported vehicle crash',
		't/a entrapment w/ fire large' : 'Reported vehicle crash with fire',
		't/a entrapment w/ fire small' : 'Reported vehicle crash with fire',
		't/a veh vs bldg w/ injuries' : 'Reported auto/building collision',
		't/a veh vs bldg no injuries' : 'Reported auto/building collision, no injuries reported',
		'vehicle accident w/ hazmat' : 'Reported vehicle crash with hazmat',
		'major incident' : 'Reported possible MCI',
		'technical' : 'Reported technical rescue',
		'water' : 'Reported water rescue',
		'land' : 'Reported land rescue',
		'elevator/escalator' : 'Reported elevator or escalator rescue',
		'extremity' : 'Reported technical rescue',
		'investigation': 'Fire call - investigation',
		'outside fire': 'Fire call - investigation',
		'wildfire' : 'mountain/forest fire',
		'wildfire involving structure' : 'outside fire threatening a structure',
		'wildfire involving vehicles' : 'outside fire threatening vehicle(s)',
		'brush fire' : 'outside/brush fire',

		'hazmat': 'Reported hazardous materials incident',
		'hazmat with patients': 'Reported hazardous materials incident',
		'co problbem': 'Reported CO incident',
		'transfer': 'Reported EMS transfer',
		'active assailant/shooter': 'Reported Law Enforcement Emergency, avoid the area',

		'FAIRCR': 'Reported aircraft fire',
		'FBARN1': 'Fire call involving a barn',
		'FBARN2': 'Fire call involving a barn',
		'FBARN3': 'Fire call involving a barn',
		'FBARN4': 'Fire call involving a barn',
		'FCB': 'Reported controlled burn',
		'FCODET': 'Reported CO detector activation',
		'FHMINI': 'Reported HAZMAT incident (inside)',
		'FHMNS': 'Reported HAZMAT incident',
		'FHMOUI': 'Reported HAZMAT incident (outside)',
		'FHMSTR': 'Reported HAZMAT incident (possible fire)',
		'FLZ': 'Assist at a helicopter landing zone',
		'FMA': 'Assist with a fire department medical assist',
		'FMASTN': 'Reported mass transportation emergency',
		'FMISC': 'Request for services (misc. incident)',
		'FOTRES': 'Request for services (other-type rescue)',
		'FINI': 'Fire call - inside investigation',
		'FOUI': 'Fire call - outside investigation',
		'F1ST': 'Fire call',
		'F2ND': 'Fire call - second alarm',
		'F3RD': 'Fire call - third alarm',
		'F4TH': 'Fire call - fourth alarm',
		'FSTR1':'Fire call',
		'FSTR2': 'Fire call - second alarm',
		'FSTR3': 'Fire call - third alarm',
		'FSTR4': 'Fire call - fourth alarm',
		'FVEHICLE': 'Vehicle fire',
		'FVEHLG': 'Vehicle fire (larger vehicle)',
		'FVEHSM': 'Vehicle fire (smaller vehicle)',
		'FVSNI': 'Reported vehicle vs a structure',
		'FWARES': 'Reported water rescue',
		'FWF': 'Fire call outdoors (wildfire)',
		'FWFSTR': 'Fire call - wildfire outdoors near a structure',
		'FWFVEH': 'Fire call - wildfire outdoors near a vehicle',
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
		'LM':	'Lower Mifflin Township',
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
		'LE':	'Lebanon County',
		'FR': 'Franklin County'
	}
	return codes;

}

function unitCodeMaker () {
	let codes = {
		'MU140': 'MICU 140',
		'MU240': 'MICU 240',
		'MU340': 'MICU 340',
		'MU440': 'MICU 440',
		'MU540': 'MICU 540',
		'MU640': 'MICU 640',
		'MU740': 'MICU 740',
		'MU840': 'MICU 840',
		'MU940': 'MICU 940',
		'MU1040': 'MICU 1040',
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
