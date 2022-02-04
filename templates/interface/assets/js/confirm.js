var file_name = {};
var azimuth = {};
var elevation = {};
var color = {};
var user_num_source;
var actual_num_source;
var recording_id = '';
var curr_instruction = 1;
var modal = document.getElementById("modal");
var practice = 0; // FALSE

const colors = [0x009dff, 0xff7f0e, 0x00ff00, 0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];
const css_colors = ["#009dff", "#ff7f0e", "#00ff00", "#ff0000", "#9467bd", "#d3d3d3", "#c39b77", "#e377c2", "#bcbd22", "#00ffff"];
var request = new XMLHttpRequest(); 

// these are look up tables for annotation dots' size change
var indicators = {
	1: [],
	2: [],
	3: [],
	4: [],
	5: [],
	6: [],
	7: [],
	8: [],
	9: [],
	10: []
};

var front_indicators = {
	1: [],
	2: [],
	3: [],
	4: [],
	5: [],
	6: [],
	7: [],
	8: [],
	9: [],
	10: []
};

var side_indicators = {
	1: [],
	2: [],
	3: [],
	4: [],
	5: [],
	6: [],
	7: [],
	8: [],
	9: [],
	10: []
};


document.getElementById('message').addEventListener("click",popRules);
document.getElementById('instruction-left').addEventListener("click",move_instruction_last);
document.getElementById('instruction-right').addEventListener("click",move_instruction_next);
document.getElementById('instruction-proceed').addEventListener("click",closeRules);
document.getElementById('sign').addEventListener("click",closeRules);


function popRules(e){ 
	e.preventDefault();
	modal.style.display = "block";
	document.getElementById('instruction-proceed').style.display = 'none';
	document.getElementById('instruction-right').style.display = '';
	document.getElementById('instruction'+curr_instruction).style.display = 'none';
	document.getElementById('instruction1').style.display = '';
	curr_instruction = 1;
}

function closeRules(e){ 
	e.preventDefault();
	let audios = document.getElementsByClassName('audio-frame-instruction');
	for (let i = 0; i < audios.length; i++) {
		audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
		document.getElementById(audio_id).pause();
		document.getElementById(audios[i].id ).innerHTML = 'Click to Play Sample Audio';
	}
	modal.style.display = "none";
}

function move_instruction_next(e){
	e.preventDefault();
	if (curr_instruction == 2){ // pause all audios
		let audios = document.getElementsByClassName('audio-frame-instruction');
		for (let i = 0; i < audios.length; i++) {
			audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
			document.getElementById(audio_id).pause();
			document.getElementById(audios[i].id ).innerHTML = 'Click to Play Sample Audio';
		}
	}
	if (curr_instruction < 7) {
		document.getElementById('instruction'+curr_instruction).style.display = 'none';
		document.getElementById('instruction'+(curr_instruction+1)).style.display = '';
		curr_instruction += 1;
	}
	if (curr_instruction == 7) {
		document.getElementById("instruction-right").style.display = 'none';
		document.getElementById("instruction-proceed").style.display = '';
	}
}

function move_instruction_last(e){
	e.preventDefault();
	if (curr_instruction > 1) {
		if (curr_instruction == 2){ // pause all audios
			let audios = document.getElementsByClassName('audio-frame-instruction');
			for (let i = 0; i < audios.length; i++) {
				audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
				document.getElementById(audio_id).pause();
				document.getElementById(audios[i].id ).innerHTML = 'Click to Play Sample Audio';
			}
		}
		document.getElementById("instruction-right").style.display = '';
		document.getElementById("instruction-proceed").style.display = 'none';
		document.getElementById('instruction'+curr_instruction).style.display = 'none';
		document.getElementById('instruction'+(curr_instruction-1)).style.display = '';
		curr_instruction -= 1;
	}
}

confirm_annotation();

function confirm_annotation(){
	request.open('POST', '/confirm_annotation');
	recording_id = localStorage.getItem('recording').replace('.wav','');
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			console.log(request.response);
			if (parseInt(localStorage.getItem('practice'))) {
				practice = 1;
				document.getElementById('btn-button-again').style.display = '';
				document.getElementById('btn-button-next').style.display = '';
			}
			else{
				document.getElementById('btn-button-submit').style.display = '';
			}

			document.getElementById("user_note").value = localStorage.getItem("user_note");
			color = JSON.parse(request.response)["color"];
			azimuth = JSON.parse(request.response)["azimuth"];
			elevation = JSON.parse(request.response)["elevation"];

			console.log(azimuth);

			user_num_source = parseInt(JSON.parse(request.response)["user_num_source"]["0"]);
			actual_num_source = parseInt(JSON.parse(request.response)["actual_num_source"]["0"]);

			document.getElementById('original-audio-source').src = '/templates/interface/assets/audio/recording/'+localStorage.getItem('recording');
			document.getElementById('audio-full').load();

			for (const [key,value] of Object.entries( JSON.parse(request.response)["file_name"] )) {
				let new_td = document.createElement('td');

				let new_audio = document.createElement('audio');
				new_audio.id = "audio-"+key;
				new_audio.controls = true;
				new_audio.style.display = "none";

				let new_audio_source = document.createElement('source');
				new_audio_source.id = "audio-source-"+key;
				new_audio_source.type = "audio/wav";
				new_audio_source.src = '/templates/interface/assets/audio/source/'+value;
				new_audio.appendChild(new_audio_source);

				let new_button = document.createElement('button');
				new_button.id = "audio-frame-"+key;
				new_button.className = "audio-frame";

				// styling of buttons
				new_button.style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";
				new_button.style.width = "60px";
				new_button.style.cursor = "pointer";
				new_button.style.border = "1px black solid";
				new_button.innerHTML = "Play Audio";
				// end of styling
				new_td.appendChild(new_audio);
				new_td.appendChild(new_button);
				document.getElementById("class-name").appendChild(new_td);
			}

			for (const [key,value] of Object.entries(color)) {

				addLocation([azimuth[key], elevation[key], value]);
				changeSize(value);

				let new_tr =  document.createElement('tr');
				let new_td_color = document.createElement('td');
				let new_div = document.createElement('div');
				new_div.className = 'confirm-indicator';
				new_div.style.backgroundColor = css_colors[parseInt(value)-1];
				new_div.innerHTML = value;
				new_td_color.appendChild(new_div);
				new_tr.appendChild(new_td_color);
				for (let i = 0; i < actual_num_source; i++){
					let new_td = document.createElement('td');
					let new_checkbox = document.createElement('input');
					new_checkbox.id = 'checkbox-'+key+'-'+i;
					new_checkbox.className = 'checkbox-'+key;
					new_checkbox.type = 'checkbox';
					new_td.appendChild(new_checkbox);
					new_tr.appendChild(new_td);
				}
				document.getElementById('matching-table').appendChild(new_tr);
			}
		}
	}
 	let survey_id = localStorage.getItem('survey_id');
	request.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({recording_id, survey_id});
	request.send(data);
}

document.addEventListener('click', function(e){

	if (e.target.id.substring(0,23) == "audio-frame-instruction") {
		let audios = document.getElementsByClassName('audio-frame');
		for(let i = 0; i < audios.length; i++) {
			let audio_id = '';
			if (audios[i].id == "audio-frame") audio_id = "audio-frame-full";
			else audio_id = "audio-" + audios[i].id.replace("audio-frame-","");
			document.getElementById(audio_id).pause();
			document.getElementById(audios[i].id ).innerHTML = 'Play Audio';
		}

		audios = document.getElementsByClassName('audio-frame-instruction');

		let playing_id = '';
		for(let i = 0; i < audios.length; i++) {
			let audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
			if (audios[i].id != e.target.id) {
				document.getElementById(audio_id).pause();
				document.getElementById(audios[i].id ).innerHTML = 'Click to Play Sample Audio';
			}
			else {
				playing_id = audio_id;
				document.getElementById(audios[i].id).innerHTML = document.getElementById(audios[i].id).innerHTML == 'Click to Play Sample Audio' ? 'Click to Pause Sample Audio' : 'Click to Play Sample Audio';
				document.getElementById(audios[i].id).innerHTML == 'Click to Play Sample Audio' ? document.getElementById(audio_id).pause() : document.getElementById(audio_id).play();
			}
		}

		if (playing_id != ''){
			document.getElementById(playing_id).addEventListener("timeupdate",function(){
				if (playing_id.replace('audio-','') == e.target.id.replace('audio-frame-instruction-','')) {
					let track = document.getElementById(playing_id).currentTime / document.getElementById(playing_id).duration * 100;
					document.getElementById(e.target.id).style.background = 'linear-gradient(to right, #efefef '+ track +'%, #ffffff 0%)';
				}
			});
			document.getElementById(playing_id).addEventListener("ended",function(){
				document.getElementById(e.target.id).innerHTML = 'Click to Play Sample Audio';
			});
		}
	}
	if (e.target.id.substring(0,11) == "audio-frame") {
		let audios = document.getElementsByClassName('audio-frame');

		let playing_id = '';
		for(let i = 0; i < audios.length; i++) {
			let audio_id = '';
			if (audios[i].id == "audio-frame") audio_id = "audio-frame-full";
			else audio_id = "audio-" + audios[i].id.replace("audio-frame-","");

			if (audios[i].id != e.target.id) {
				document.getElementById(audio_id).pause();
				document.getElementById(audios[i].id ).innerHTML = 'Play Audio';
			}
			else {
				playing_id = audio_id;
				document.getElementById(audios[i].id).innerHTML = document.getElementById(audios[i].id).innerHTML == 'Play Audio' ? 'Pause Audio' : 'Play Audio';
				document.getElementById(audios[i].id).innerHTML == 'Play Audio' ? document.getElementById(audio_id).pause() : document.getElementById(audio_id).play();
			}
		}
		if (playing_id != '') {
			document.getElementById(playing_id).addEventListener("timeupdate",function(){
				if (playing_id.replace('audio-','') == e.target.id.replace('audio-frame-','')){
					let track = document.getElementById(playing_id).currentTime / document.getElementById(playing_id).duration * 100;
					document.getElementById(e.target.id).style.background = 'linear-gradient(to right, #efefef '+ track +'%, #ffffff 0%)';
				}
			});
			document.getElementById(playing_id).addEventListener("ended",function(){
				document.getElementById(e.target.id).innerHTML = 'Play Audio';
			});

		}
	}
	else if (e.target.id.substring(0,8) =="checkbox"){
		tail = e.target.id.substring(e.target.id.length-1, e.target.id.length);
		for (let i = 0; i < user_num_source; i++) {
			id_name = "checkbox-"+i+"-"+tail;
			if ( e.target.id != id_name && document.getElementById(id_name).checked ) document.getElementById(id_name).checked = false;
		}

		let checkboxes = document.getElementsByClassName(e.target.className);

		for (let i = 0; i < checkboxes.length; i++) {
			if ( checkboxes[i].id != e.target.id && document.getElementById(checkboxes[i].id).checked ) document.getElementById(checkboxes[i].id).checked = false;
		}
	}
});

function addLocation(coordinates) {
	let item_index = coordinates[2];

	// Azimuth Annotation Display
	document.getElementById('head-item-'+item_index).style.display = '';
	document.getElementById('circular'+item_index).style.display = '';
	document.getElementById('circular'+item_index).style.transform = 'rotate('+coordinates[0]+'deg)';

	coordinates[0] = parseInt(coordinates[0]);
	coordinates[1] = parseInt(coordinates[1]);

	// Elevation Annotation Display
	if (coordinates[0] > 337.5 || coordinates[0] < 22.5){
		document.getElementById('side-item-'+item_index).style.display = '';
		document.getElementById('circularS'+item_index).style.display = '';
		let e = 90 + -1 * coordinates[1];
		document.getElementById('circularS'+item_index).style.transform = 'rotate('+e+'deg)';

	}
	else if (coordinates[0] >= 22.5 && coordinates[0] <= 67.5){
		document.getElementById('front-item-'+item_index).style.display = '';
		document.getElementById('circularF'+item_index).style.display = '';
		document.getElementById('side-item-'+item_index).style.display = '';
		document.getElementById('circularS'+item_index).style.display = '';
		let e = 90 + -1 * coordinates[1];
		document.getElementById('circularF'+item_index).style.transform = 'rotate('+e+'deg)';
		document.getElementById('circularS'+item_index).style.transform = 'rotate('+e+'deg)';

	}
	else if (coordinates[0] > 67.5 && coordinates[0] < 112.5){
		document.getElementById('front-item-'+item_index).style.display = '';
		document.getElementById('circularF'+item_index).style.display = '';
		let e = 90 + -1 * coordinates[1];
		document.getElementById('circularF'+item_index).style.transform = 'rotate('+e+'deg)';

	}
	else if (coordinates[0] >= 112.5 && coordinates[0] <= 157.5){
		document.getElementById('front-item-'+item_index).style.display = '';
		document.getElementById('circularF'+item_index).style.display = '';
		document.getElementById('side-item-'+item_index).style.display = '';
		document.getElementById('circularS'+item_index).style.display = '';
		let e1 = 90 + -1 * coordinates[1];
		let e2 = coordinates[1] + 270;
		document.getElementById('circularF'+item_index).style.transform = 'rotate('+e1+'deg)';
		document.getElementById('circularS'+item_index).style.transform = 'rotate('+e2+'deg)';

	}
	else if (coordinates[0] > 157.5 && coordinates[0] < 202.5){
		document.getElementById('side-item-'+item_index).style.display = '';
		document.getElementById('circularS'+item_index).style.display = '';
		let e = coordinates[1] + 270;
		document.getElementById('circularS'+item_index).style.transform = 'rotate('+e+'deg)';

	}
	else if (coordinates[0] >= 202.5 && coordinates[0] <= 247.5){
		document.getElementById('front-item-'+item_index).style.display = '';
		document.getElementById('circularF'+item_index).style.display = '';
		document.getElementById('side-item-'+item_index).style.display = '';
		document.getElementById('circularS'+item_index).style.display = '';
		let e = coordinates[1] + 270;
		document.getElementById('circularF'+item_index).style.transform = 'rotate('+e+'deg)';
		document.getElementById('circularS'+item_index).style.transform = 'rotate('+e+'deg)';

	}
	else if (coordinates[0] > 247.5 && coordinates[0] < 292.5){
		document.getElementById('front-item-'+item_index).style.display = '';
		document.getElementById('circularF'+item_index).style.display = '';
		let e = coordinates[1] + 270;
		document.getElementById('circularF'+item_index).style.transform = 'rotate('+e+'deg)';
	}
	else {
		document.getElementById('front-item-'+item_index).style.display = '';
		document.getElementById('circularF'+item_index).style.display = '';
		document.getElementById('side-item-'+item_index).style.display = '';
		document.getElementById('circularS'+item_index).style.display = '';
		let e1 = 90 + -1 * coordinates[1];
		let e2 = coordinates[1] + 270;
		document.getElementById('circularF'+item_index).style.transform = 'rotate('+e2+'deg)';
		document.getElementById('circularS'+item_index).style.transform = 'rotate('+e1+'deg)';

	}
	displayBall(coordinates[0]-180, coordinates[1], item_index);
}

function submit_confirmation(){
	recording_id = parseInt(recording_id) + 1;
	let location_id = '';
	let source_id = ''
	let total_confirmation_num = 0;
	let checkboxes = document.getElementsByTagName('input');
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			total_confirmation_num += 1;
			break;
		}
	}
	if (total_confirmation_num < 1) {
		window.alert("You must confirm at least 1 annotation");
		return false;
	}
	for (const [key,value] of Object.entries( JSON.parse(request.response)["location_id"])) {
		total_confirmation_num += 1;
		location_id += value + ',';
	}
	for (const [key,value] of Object.entries( JSON.parse(request.response)["source_id"] )) {
		source_id += value + ',';
	}
	localStorage.setItem('full_round', true);
	location_id = location_id.substring(0,location_id.length-1);
	source_id = source_id.substring(0,source_id.length-1);
	request.open('POST', '/submit_confirmation', true);
	request.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	let survey_id = localStorage.getItem('survey_id');
	var data = JSON.stringify({recording_id, location_id, source_id, practice, survey_id});
	request.send(data);
	return true;
}

document.getElementById('btn-button-submit').addEventListener('click', function(){
	if (submit_confirmation()) window.location = '/templates/interface/submit.html';
});
document.getElementById('btn-button-again').addEventListener('click', function(){
	if (submit_confirmation()) window.location = '/templates/interface/practice.html';
});
document.getElementById('btn-button-next').addEventListener('click', function(){
	if (submit_confirmation()) window.location = '/templates/interface/interface.html';
});

function changeSize(item_index){

	const selected_azimuth = azimuth[(item_index - 1).toString()];
	console.log(selected_azimuth, Object.keys(azimuth).length);
	let size = 18 - 8;
	let margin_top = -65 + 4;
	let margin_left = 0 + 4;

	for ( let index = Object.keys(azimuth).length - 1; index > -1; index-- ){
		if ( selected_azimuth != undefined && Math.abs( selected_azimuth - azimuth[index] ) <= 5) {
			if ( index != (item_index - 1) ){
				indicators[item_index][index] = true;
				indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('head-item-'+(index + 1)).style.width = size.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.fontSize = (size - 3).toString() + 'px';

		}
		else if ( selected_azimuth == undefined || Math.abs( selected_azimuth - azimuth[index] ) > 5 ) {
			if ( item_index == 1 && indicators[1][index] ) {
				indicators[1][index] = undefined;
				indicators[index+1][0] = undefined; 
			}
			else if ( item_index == 2 && indicators[2][index] ){
				indicators[2][index] = undefined;
				indicators[index+1][1] = undefined;

				if (index < 1){
					document.getElementById('head-item-1').style.width = (parseInt(document.getElementById('head-item-1').style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-1').style.height = (parseInt(document.getElementById('head-item-1').style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-1').style.marginTop = (parseInt(document.getElementById('head-item-1').style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-1').style.marginLeft = (parseInt(document.getElementById('head-item-1').style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-1').style.fontSize = (parseInt(document.getElementById('head-item-1').style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 3 && indicators[3][index] ) {
				indicators[3][index] = undefined;
				indicators[index+1][2] = undefined;

				if (index < 2){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 4 && indicators[4][index] ) {
				indicators[4][index] = undefined;
				indicators[index+1][3] = undefined;

				if (index < 3){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 5 && indicators[5][index] ) {
				indicators[5][index] = undefined;
				indicators[index+1][4] = undefined;

				if (index < 4){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 6 && indicators[6][index]) {
				indicators[6][index] = undefined;
				indicators[index+1][5] = undefined;

				if (index < 5){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 7 && indicators[7][index] ) {
				indicators[7][index] = undefined;
				indicators[index+1][6] = undefined;

				if (index < 6){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 8 && indicators[8][index] ) {
				indicators[8][index] = undefined;
				indicators[index+1][7] = undefined;

				if (index < 7){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 9 && indicators[9][index] ) {
				indicators[9][index] = undefined;
				indicators[index+1][8] = undefined;

				if (index < 8){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 10 && indicators[10][index] )  {
				indicators[10][index] = undefined;
				indicators[index+1][9] = undefined;

				if (index < 9){
					document.getElementById('head-item-'+(index + 1)).style.width = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('head-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
		}
	}

	const selected_elevation = elevation[item_index - 1];
	const selected_elevation_degree = parseInt(document.getElementById('circularF'+item_index).style.transform.replace('rotate(','').replace('deg)',''));
	size = 18 - 8;
	margin_top = -65 + 4;
	margin_left = 0 + 4;

	for ( let index = Object.keys(elevation).length - 1; index > -1; index-- ) {
		const current_index_degree = document.getElementById('circularF'+(index+1)).style.display != 'none' ? parseInt(document.getElementById('circularF'+(index+1)).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation != undefined && Math.abs( selected_elevation_degree - current_index_degree ) <= 3 ) {
			if ( index != (item_index - 1) ){
				front_indicators[item_index][index] = true;
				front_indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('front-item-'+(index + 1)).style.width = size.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.fontSize = (size - 3).toString() + 'px';

		}
		else if ( selected_elevation == undefined || Math.abs( selected_elevation_degree - current_index_degree ) > 3 ) {
			if ( item_index == 1 && front_indicators[1][index] ) {
				front_indicators[1][index] = undefined;
				front_indicators[index+1][0] = undefined; 
			}
			else if ( item_index == 2 && front_indicators[2][index] ){
				front_indicators[2][index] = undefined;
				front_indicators[index+1][1] = undefined;

				if (index < 1){
					document.getElementById('front-item-1').style.width = (parseInt(document.getElementById('front-item-1').style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-1').style.height = (parseInt(document.getElementById('front-item-1').style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-1').style.marginTop = (parseInt(document.getElementById('front-item-1').style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-1').style.marginLeft = (parseInt(document.getElementById('front-item-1').style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-1').style.fontSize = (parseInt(document.getElementById('front-item-1').style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 3 && front_indicators[3][index] ) {
				front_indicators[3][index] = undefined;
				front_indicators[index+1][2] = undefined;

				if (index < 2){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 4 && front_indicators[4][index] ) {
				front_indicators[4][index] = undefined;
				front_indicators[index+1][3] = undefined;

				if (index < 3){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 5 && front_indicators[5][index] ) {
				front_indicators[5][index] = undefined;
				front_indicators[index+1][4] = undefined;

				if (index < 4){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 6 && front_indicators[6][index]) {
				front_indicators[6][index] = undefined;
				front_indicators[index+1][5] = undefined;

				if (index < 5){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 7 && front_indicators[7][index] ) {
				front_indicators[7][index] = undefined;
				front_indicators[index+1][6] = undefined;

				if (index < 6){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 8 && front_indicators[8][index] ) {
				front_indicators[8][index] = undefined;
				front_indicators[index+1][7] = undefined;

				if (index < 7){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 9 && front_indicators[9][index] ) {
				front_indicators[9][index] = undefined;
				front_indicators[index+1][8] = undefined;

				if (index < 8){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 10 && front_indicators[10][index] )  {
				front_indicators[10][index] = undefined;
				front_indicators[index+1][9] = undefined;

				if (index < 9){
					document.getElementById('front-item-'+(index + 1)).style.width = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('front-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
		}
	}

	const selected_elevation2 = elevation[item_index - 1];
	const selected_elevation_degree2 = parseInt(document.getElementById('circularS'+item_index).style.transform.replace('rotate(','').replace('deg)',''));
	size = 18 - 8;
	margin_top = -65 + 4;
	margin_left = 0 + 4;

	for ( let index = Object.keys(elevation).length - 1; index > -1; index-- ) {
		const current_index_degree2 = document.getElementById('circularS'+(index+1)).style.display != 'none' ? parseInt(document.getElementById('circularS'+(index+1)).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation2 != undefined && Math.abs( selected_elevation_degree2 - current_index_degree2 ) <= 3 ) {
			if ( index != (item_index - 1) ){
				side_indicators[item_index][index] = true;
				side_indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('side-item-'+(index + 1)).style.width = size.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.fontSize = (size - 3).toString() + 'px';

		}
		else if ( selected_elevation2 == undefined || Math.abs( selected_elevation_degree2 - current_index_degree2 ) > 3 ) {
			if ( item_index == 1 && side_indicators[1][index] ) {
				side_indicators[1][index] = undefined;
				side_indicators[index+1][0] = undefined; 
			}
			else if ( item_index == 2 && side_indicators[2][index] ){
				side_indicators[2][index] = undefined;
				side_indicators[index+1][1] = undefined;

				if (index < 1){
					document.getElementById('side-item-1').style.width = (parseInt(document.getElementById('side-item-1').style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-1').style.height = (parseInt(document.getElementById('side-item-1').style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-1').style.marginTop = (parseInt(document.getElementById('side-item-1').style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-1').style.marginLeft = (parseInt(document.getElementById('side-item-1').style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-1').style.fontSize = (parseInt(document.getElementById('side-item-1').style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 3 && side_indicators[3][index] ) {
				side_indicators[3][index] = undefined;
				side_indicators[index+1][2] = undefined;

				if (index < 2){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 4 && side_indicators[4][index] ) {
				side_indicators[4][index] = undefined;
				side_indicators[index+1][3] = undefined;

				if (index < 3){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 5 && side_indicators[5][index] ) {
				side_indicators[5][index] = undefined;
				side_indicators[index+1][4] = undefined;

				if (index < 4){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 6 && side_indicators[6][index]) {
				side_indicators[6][index] = undefined;
				side_indicators[index+1][5] = undefined;

				if (index < 5){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 7 && side_indicators[7][index] ) {
				side_indicators[7][index] = undefined;
				side_indicators[index+1][6] = undefined;

				if (index < 6){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 8 && side_indicators[8][index] ) {
				side_indicators[8][index] = undefined;
				side_indicators[index+1][7] = undefined;

				if (index < 7){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 9 && side_indicators[9][index] ) {
				side_indicators[9][index] = undefined;
				side_indicators[index+1][8] = undefined;

				if (index < 8){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
			else if ( item_index == 10 && side_indicators[10][index] )  {
				side_indicators[10][index] = undefined;
				side_indicators[index+1][9] = undefined;

				if (index < 9){
					document.getElementById('side-item-'+(index + 1)).style.width = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 8).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginLeft = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginLeft.replace('px','')) + 4).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.fontSize = (parseInt(document.getElementById('side-item-'+(index + 1)).style.width.replace('px','')) - 3).toString() + 'px';
				}
			}
		}
	}
}


/* Three.js */

container = document.getElementById('3d-head');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
var light = new THREE.HemisphereLight(0xffffff, 0.8);
scene.add(light);

// front light
var pointLight = new THREE.PointLight(0xffffff, 0.8, 0);
pointLight.position.set(30, 30, 250);
scene.add(pointLight);

// back light
var pointLight2 = new THREE.PointLight(0xffffff, 0.8, 0);
pointLight2.position.set(30, 30, -250);
scene.add(pointLight2);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 30;

var sphereGeometry = new THREE.SphereGeometry(8,60,30);
var sphereMaterial = new THREE.MeshLambertMaterial({
	map: new THREE.TextureLoader().load('/templates/interface/img/face.png'),
	color: 0xefd8c3
});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0,0,0);

var ear1Geometry = new THREE.TorusGeometry(1,1.2,30,100);
var ear1Material = new THREE.MeshLambertMaterial({
	color: 0xc2a68b
});
var ear1 = new THREE.Mesh(ear1Geometry, ear1Material);
ear1.position.set(7.8,0,0);

var ear2Geometry = new THREE.TorusGeometry(1,1.2,30,100);
var ear2Material = new THREE.MeshLambertMaterial({
	color: 0xc2a68b
});
var ear2 = new THREE.Mesh(ear2Geometry, ear2Material);
ear2.position.set(-7.8,0,0);

var noseGeometry = new THREE.TorusGeometry(0.3,0.8,30,100);
var noseMaterial = new THREE.MeshLambertMaterial({
	color: 0xc2a68b
});
var nose = new THREE.Mesh(noseGeometry, noseMaterial);
nose.position.set(0,0,7.4);
nose.rotation.y = 90;

var frameGeometry = new THREE.SphereBufferGeometry(15,20,20);
var frameMaterial = new THREE.MeshLambertMaterial({});
var frame = new THREE.Mesh(frameGeometry, frameMaterial);
var edgesGeometry = new THREE.EdgesGeometry(frameGeometry);
var wireframe = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({color: 0x0000ff})); 

var ballGeometry;
var ballMaterial;

function toRadian(angle){
	return angle * Math.PI / 180;
}

function polarToCartesian(lon, lat, radius) {
	var phi = ( 90 - lat ) * Math.PI / 180
	var theta = ( lon + 180 ) * Math.PI / 180
	return {
	  x: -(radius * Math.sin(phi) * Math.sin(theta)),
	  y: radius * Math.cos(phi),
	  z: radius * Math.sin(phi) * Math.cos(theta),
	}
}

function displayBall(azimuth, elevation, number){
	var returnlist = polarToCartesian(azimuth, elevation, 15);
	ballGeometry = new THREE.SphereGeometry(0.8,60,30);
	ballMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load('/templates/interface/img/item-'+number+'.jpg')
	});
	var ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.name = 'ball'+number;
	ball.position.set(returnlist['x'], returnlist['y'], returnlist['z']);
	scene.remove(scene.getObjectByName('ball'+number));
	scene.add(ball);

	return ball;
}

scene.add(wireframe);
scene.add(sphere);
scene.add(ear1);
scene.add(ear2);
scene.add(nose);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(440,440); //! this is different from the size of the ball at annotation interface
container.appendChild(renderer.domElement);

camera.lookAt(sphere.position);

controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 400; //! this is different from the size of the ball at annotation interface

function animate(){
	requestAnimationFrame(animate);
	// create rotation to all 3D annotations
	for (let i=0 ; i<10; i++){
		if (scene.getObjectByName('ball'+(i + 1)) != null) scene.getObjectByName('ball'+(i + 1)).rotation.y += 0.05;
	}
	controls.update();
	renderer.render(scene,camera); 
}
animate();