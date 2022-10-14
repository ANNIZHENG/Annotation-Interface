/* 
This if statement checks if the user did the screening tests and agrees the consent form 
*/
if (localStorage.getItem('agree_consent_form') != '1' || localStorage.getItem('stereo') != '1' || localStorage.getItem('headphone') != '1' || localStorage.getItem('survey_id') == undefined || localStorage.getItem('survey_id') == null){
		window.location = '/templates/interface/incomplete.html';
}

var file_name = {};
var azimuth = {};
var elevation = {};
var color = {};
var locations = {};
var sources = {};
var user_num_source;
var actual_num_source;
var recording_name = '';
var curr_instruction = 1;
var practice = -1;
var modal = document.getElementById("modal");
const totalInstructions = 8;
const colors = [0x009dff, 0xff7f0e, 0x00ff00, 0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];
const css_colors = ["#009dff", "#ff7f0e", "#00ff00", "#ff0000", "#9467bd", "#d3d3d3", "#c39b77", "#e377c2", "#bcbd22", "#00ffff"];
const audio_path = 'https://assets-audio2.s3.amazonaws.com/audio'
const audio_path_practice = '/templates/interface/assets/audio/practice/';

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

/*
The listener pops up the general instructions of this interface
*/
document.getElementById('message').addEventListener("click",popRules);
/*
While the general instructions is displayed, 
this listener controls flips to the last instruction
*/
document.getElementById('instruction-left').addEventListener("click",move_instruction_last);
/*
While the general instructions is displayed, 
this listener controls flips to the next instruction
*/
document.getElementById('instruction-right').addEventListener("click",move_instruction_next);
/*
While the general instructions is displayed, and the last page is reached
this listener closes the general instructions
*/
document.getElementById('instruction-proceed').addEventListener("click",closeRules);
/*
The listener closes the general instructions window
This listener can only be triggered after the user reads all of the instructions
or that user is in confirmation or annotation page
*/
document.getElementById('sign').addEventListener("click",closeRules);
/*
The two event listeners below scale the display of the page to the size that
almost no buttons or images are hidden
*/
window.addEventListener('load', scaleWindow);
window.addEventListener('resize', scaleWindow);

/* 
scale the display of the page to the size that almost no buttons or images are hidden 
*/
function scaleWindow() {
	const body = document.querySelector('body');
	body.style.transform = 'scale(1)';

	if (window.innerWidth < 950 || window.innerHeight < 800) {
		let percentage_height = Math.floor(window.innerWidth / 1100 * 100) / 100;
		let percentage_width = Math.floor(window.innerHeight / 800 * 100) / 100;

		if (percentage_height < percentage_width) body.style.transform = 'scale(' + percentage_height + ')';
		else body.style.transform = 'scale(' + percentage_width + ')';
	}
}

/*
pop General Instructions
*/
function popRules(e){ 
	e.preventDefault();
	modal.style.display = "block";
	document.getElementById('instruction-proceed').style.display = 'none';
	document.getElementById('instruction-right').style.display = '';
	document.getElementById('instruction'+curr_instruction).style.display = 'none';
	document.getElementById('instruction1').style.display = '';
	curr_instruction = 1;
}

/*
close general instructions
*/
function closeRules(e){ 
	let videos = document.getElementsByTagName('video');
	for(let i = 0; i<videos.length; i++){
		videos[i].pause();
	}
	let audios = document.getElementsByClassName('audio-frame-instruction');
	for (let i = 0; i < audios.length; i++) {
		audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
		document.getElementById(audio_id).pause();
		document.getElementById(audios[i].id ).innerHTML = 'Play an Example';
	}
	modal.style.display = "none";
}

/*
Flip to the next page of the general instructions
Instruction videos are played when that page is reached (except for page 2 which contains sample audios)
When the user is leaving page 2, its played audio will stop
*/
function move_instruction_next(e){
	e.preventDefault();

	let instruction_video_1 = document.getElementById('instruction-video-1');
	let instruction_video_1_remain = document.querySelector('.instruction-video-1-remain');
	let instruction_video_2 = document.getElementById('instruction-video-2');
	let instruction_video_2_remain = document.querySelector('.instruction-video-2-remain');
	let instruction_video_3 = document.getElementById('instruction-video-3');
	let instruction_video_3_remain = document.querySelector('.instruction-video-3-remain');
	let instruction_video_4 = document.getElementById('instruction-video-4');
	let instruction_video_4_remain = document.querySelector('.instruction-video-4-remain');
	let instruction_video_5 = document.getElementById('instruction-video-5');
	let instruction_video_5_remain = document.querySelector('.instruction-video-5-remain');
	let instruction_video_6 = document.getElementById('instruction-video-6');
	let instruction_video_6_remain = document.querySelector('.instruction-video-6-remain');

	if (curr_instruction == 1) {
		instruction_video_1.currentTime = 0;

		instruction_video_1.addEventListener('timeupdate', () => {
			instruction_video_1_remain.innerHTML = (Math.round(instruction_video_1.currentTime * 100) / 100).toFixed(2) + "  /  " + (Math.round(instruction_video_1.duration * 100) / 100).toFixed(2);
		});

		instruction_video_1.play();
	}
	else instruction_video_1.pause();

	if (curr_instruction == 3){
		let audios = document.getElementsByClassName('audio-frame-instruction');
		for (let i = 0; i < audios.length; i++) {
			audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
			document.getElementById(audio_id).pause();
			document.getElementById(audios[i].id ).innerHTML = 'Play an Example';
		}

		instruction_video_2.currentTime = 0;

		instruction_video_2.addEventListener('timeupdate', () => {
			instruction_video_2_remain.innerHTML = (Math.round(instruction_video_2.currentTime * 100) / 100).toFixed(2) + "  /  " + (Math.round(instruction_video_2.duration * 100) / 100).toFixed(2);
		});

		instruction_video_2.play();
	}
	else instruction_video_2.pause();

	if (curr_instruction == 4) {
		instruction_video_3.currentTime = 0;

		instruction_video_3.addEventListener('timeupdate', () => {
			instruction_video_3_remain.innerHTML = (Math.round(instruction_video_3.currentTime * 100) / 100).toFixed(2) + "  /  " + (Math.round(instruction_video_3.duration * 100) / 100).toFixed(2);
		});

		instruction_video_3.play();
	}
	else instruction_video_3.pause();

	if (curr_instruction == 5) {
		instruction_video_4.currentTime = 0;

		instruction_video_4.addEventListener('timeupdate', () => {
			instruction_video_4_remain.innerHTML = (Math.round(instruction_video_4.currentTime * 100) / 100).toFixed(2) + "  /  " + (Math.round(instruction_video_4.duration * 100) / 100).toFixed(2);
		});

		instruction_video_4.play();
	}
	else instruction_video_4.pause();

	if (curr_instruction == 6) {
		instruction_video_5.currentTime = 0;

		instruction_video_5.addEventListener('timeupdate', () => {
			instruction_video_5_remain.innerHTML = (Math.round(instruction_video_5.currentTime * 100) / 100).toFixed(2) + "  /  " + (Math.round(instruction_video_5.duration * 100) / 100).toFixed(2);
		});

		instruction_video_5.play();
	}
	else instruction_video_5.pause();

	if (curr_instruction == 7) {
		instruction_video_6.currentTime = 0;

		instruction_video_6.addEventListener('timeupdate', () => {
			instruction_video_6_remain.innerHTML = (Math.round(instruction_video_6.currentTime * 100) / 100).toFixed(2) + "  /  " + (Math.round(instruction_video_6.duration * 100) / 100).toFixed(2);
		});

		instruction_video_6.play();
	}
	else instruction_video_6.pause();

	if (curr_instruction < totalInstructions) {
		document.getElementById('instruction'+curr_instruction).style.display = 'none';
		document.getElementById('instruction'+(curr_instruction+1)).style.display = '';
		curr_instruction += 1;
	}

	if (curr_instruction == totalInstructions) {
		document.getElementById("instruction-right").style.display = 'none';
		document.getElementById("instruction-proceed").style.display = '';
		read_all_rules = true;
	}
}

/*
Flip to the last page of the general instructions
Instruction videos are played when that page is reached (except for page 2 which contains sample audios)
When the user is leaving page 2, its played audio will stop
*/
function move_instruction_last(e){
	e.preventDefault();
	if (curr_instruction > 1) {
		if (curr_instruction == 2) document.getElementById('instruction-video-1').pause();

		if (curr_instruction == 3){ // pause all audios if move out of page 2
			let audios = document.getElementsByClassName('audio-frame-instruction');
			for (let i = 0; i < audios.length; i++) {
				audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
				document.getElementById(audio_id).pause();
				document.getElementById(audios[i].id ).innerHTML = 'Play an Example';
			}
			document.getElementById('instruction-video-1').currentTime = 0;
			document.getElementById('instruction-video-1').play();
		}

		if (curr_instruction == 4) document.getElementById('instruction-video-2').pause();

		if (curr_instruction == 5) {
			document.getElementById('instruction-video-2').currentTime = 0;
			document.getElementById('instruction-video-2').play();
			document.getElementById('instruction-video-3').pause();
		}

		if (curr_instruction == 6) {
			document.getElementById('instruction-video-3').currentTime = 0;
			document.getElementById('instruction-video-3').play();
			document.getElementById('instruction-video-4').pause();
		}

		if (curr_instruction == 7) {
			document.getElementById('instruction-video-4').currentTime = 0;
			document.getElementById('instruction-video-4').play();
			document.getElementById('instruction-video-5').pause();
		}

		if (curr_instruction == 8) {
			document.getElementById('instruction-video-5').currentTime = 0;
			document.getElementById('instruction-video-5').play();
			document.getElementById('instruction-video-6').pause();
		}

		document.getElementById("instruction-right").style.display = '';
		document.getElementById("instruction-proceed").style.display = 'none';
		document.getElementById('instruction'+curr_instruction).style.display = 'none';
		document.getElementById('instruction'+(curr_instruction-1)).style.display = '';
		curr_instruction -= 1;
	}
}

confirm_annotation();

/*
sends AJAX request to the backend to retrieve the annotated location, sub-audios, full audios
and the colors of each annotation dot from the database and display them to the Confirmation page
*/
function confirm_annotation(){
	var request = new XMLHttpRequest(); 
	request.open('POST', '/confirm_annotation');
	let vertical = parseInt(localStorage.getItem('vertical'))

	recording_name = localStorage.getItem('recording')
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			if (parseInt(localStorage.getItem('practice_boolean'))) {
				practice = 1; // set global bool variable practice to true
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
			locations = JSON.parse(request.response)["location_id"];
			sources = JSON.parse(request.response)["source_id"];
			user_num_source = parseInt(JSON.parse(request.response)["user_num_source"]["0"]);
			actual_num_source = parseInt(JSON.parse(request.response)["actual_num_source"]["0"]);

			let recording_file_name = ''
			if (vertical == 2) recording_file_name = "practice";
 			else if (vertical == 0) recording_file_name = "horizontal";
			else recording_file_name = "horizontal_vertical";

			if (parseInt(localStorage.getItem('practice_boolean'))) document.getElementById('original-audio-source').src = audio_path_practice + localStorage.getItem('recording');
			else document.getElementById('original-audio-source').src = audio_path + "/recording/" + recording_file_name + '/' + localStorage.getItem('recording');
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
				new_audio_source.src = audio_path + '/source/' + value;
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

				new_td.appendChild(new_audio);
				new_td.appendChild(new_button);
				document.getElementById("class-name").appendChild(new_td);
			}

			for (const [key,value] of Object.entries(color)) {

				addLocation([azimuth[key], elevation[key], value]);
				changeSize(parseInt(key)+1);

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
					new_checkbox.className = 'checkbox-'+key+'-'+locations[key];
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
	var data = JSON.stringify({recording_name, survey_id, vertical});
	request.send(data);
}

/* 
The listener updates the audio progress bar and plays the audio when the user 
clicks the "Play" button in the instructions window
*/
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
				document.getElementById(audios[i].id ).innerHTML = 'Play an Example';
			}
			else {
				playing_id = audio_id;
				document.getElementById(audios[i].id).innerHTML = document.getElementById(audios[i].id).innerHTML == 'Play an Example' ? 'Pause This Example' : 'Play an Example';
				document.getElementById(audios[i].id).innerHTML == 'Play an Example' ? document.getElementById(audio_id).pause() : document.getElementById(audio_id).play();
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
				document.getElementById(e.target.id).innerHTML = 'Play an Example';
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

/*
This method used the location info retrieved from the database (azimuth and elevation) and
used them to position annotation dot for display
This method also detects if the annotation dot should be displayed in both
side (Back side and Side side) of the 2D images for elevation annotation
*/
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

/*
This method sends an AJAX request to the backend to store the matching between the annotation dots and the sub-audio files
The matching is determined by the matching between the sequence of the annotation dots with the sequence of the checks
*/
function submit_confirmation(){
	let location_id = '';
	let source_id = ''
	let total_confirmation_num = 0;
	let checkboxes = document.getElementsByTagName('input');

	let confirm_location_id = [];
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			confirm_location_id[parseInt(checkboxes[i].id.substring(checkboxes[i].id.length-1,checkboxes[i].id.length))] = checkboxes[i].className.split('-')[2];
			total_confirmation_num += 1;
		}
	}

	if (total_confirmation_num < 1) {
		window.alert("You must match at least one audio recording to an annotated location");
		return false;
	}

	for (let i=0; i<confirm_location_id.length; i++) {
		temp = confirm_location_id[i] == undefined ? 'undefined' : confirm_location_id[i];
		location_id += temp + ',';
	}

	for (const [key,value] of Object.entries( sources )) {
		source_id += value + ',';
	}

	localStorage.setItem('full_round', true);
	location_id = location_id.substring(0,location_id.length-1);
	source_id = source_id.substring(0,source_id.length-1);
	timestamp = Date.now();

	var request_submit = new XMLHttpRequest(); 
	request_submit.open('POST', '/submit_confirmation', true);
	request_submit.setRequestHeader('content-type', 'application/json;charset=UTF-8');

	let survey_id = localStorage.getItem('survey_id');
	let vertical = parseInt(localStorage.getItem('vertical'));
	var data = JSON.stringify({recording_name, location_id, source_id, practice, survey_id, vertical, timestamp});

	request_submit.send(data);
	request_submit.onreadystatechange = function() {
		if (request_submit.readyState == 4){
			if (request_submit.responseText != 'success' && practice != 1){
				// this is triggered only when the actual data are not saved
				window.alert("Something is wrong with saving your data. Please REFERSH THIS PAGE or RESTART THE TASK.");
				return;
			}
		}
	}
	return true;
}

/*
This event listener is triggerd when a user completes the actual annotation
*/
document.getElementById('btn-button-submit').addEventListener('click', function(){
	if (submit_confirmation()) {
		localStorage.setItem('complete_annotation',1);
		window.location = '/templates/interface/submit.html';
	}
});
/*
This event listener is triggerd when a user completes one practice round and would like to practice again
*/
document.getElementById('btn-button-again').addEventListener('click', function(){
	if (submit_confirmation()) {
		let curr_recording = parseInt(localStorage.getItem('practice'))+1;
		localStorage.setItem('practice', curr_recording);
		window.location = '/templates/interface/practice.html';
	}
});
/*
This event listener is triggerd when a user completes one practice round and would like to 
enter the actual annotation interface
*/
document.getElementById('btn-button-next').addEventListener('click', function(){
	if (submit_confirmation()) {
		localStorage.setItem('complete_practice',1);
		localStorage.setItem('practice_boolean',0);
		window.location = '/templates/interface/annotation.html';
	}
});

/*
This method is used to change the annotation dot side when two or more dots are closed to each other
When the distance between two or more dots is 5 degree (of 360 degree), then the size of the dots
will change with the bottom dots having a larger size than the top dots
*/
function changeSize(item_index){

	const selected_azimuth = azimuth[(item_index - 1).toString()];

	let size = 18 - 8;
	let margin_top = -65 + 4;
	let margin_left = 0 + 4;

	for ( let index = Object.keys(color).length - 1; index > -1; index-- ) {

		if ( selected_azimuth != undefined && Math.abs( selected_azimuth - azimuth[index] ) <= 5) {
			if ( index != (item_index - 1) ){
				indicators[item_index][index] = true;
				indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('head-item-'+color[index]).style.width = size.toString() + 'px';
			document.getElementById('head-item-'+color[index]).style.height = size.toString() + 'px';
			document.getElementById('head-item-'+color[index]).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('head-item-'+color[index]).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('head-item-'+color[index]).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('head-item-'+color[index]).style.fontSize = (size - 3).toString() + 'px';
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
	const selected_elevation_degree = parseInt(document.getElementById('circularF'+color[item_index-1]).style.transform.replace('rotate(','').replace('deg)',''));

	size = 18 - 8;
	margin_top = -65 + 4;
	margin_left = 0 + 4;

	for ( let index = Object.keys(color).length - 1; index > -1; index-- ) {

		const current_index_degree = document.getElementById('circularF'+color[index]).style.display != 'none' ? parseInt(document.getElementById('circularF'+color[index]).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation != undefined && Math.abs( selected_elevation_degree - current_index_degree ) <= 5 ) {
			if ( index != (item_index - 1) ){
				front_indicators[item_index][index] = true;
				front_indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('front-item-'+color[index]).style.width = size.toString() + 'px';
			document.getElementById('front-item-'+color[index]).style.height = size.toString() + 'px';
			document.getElementById('front-item-'+color[index]).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('front-item-'+color[index]).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('front-item-'+color[index]).style.fontSize = (size - 3).toString() + 'px';

		}
		else if ( selected_elevation == undefined || Math.abs( selected_elevation_degree - current_index_degree ) > 5 ) {
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
	const selected_elevation_degree2 = parseInt(document.getElementById('circularS'+color[item_index-1]).style.transform.replace('rotate(','').replace('deg)',''));
	size = 18 - 8;
	margin_top = -65 + 4;
	margin_left = 0 + 4;

	for ( let index = Object.keys(color).length - 1; index > -1; index-- ) {
		const current_index_degree2 = document.getElementById('circularS'+color[index]).style.display != 'none' ? parseInt(document.getElementById('circularS'+color[index]).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation2 != undefined && Math.abs( selected_elevation_degree2 - current_index_degree2 ) <= 5 ) {
			if ( index != (item_index - 1) ){
				side_indicators[item_index][index] = true;
				side_indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('side-item-'+color[index]).style.width = size.toString() + 'px';
			document.getElementById('side-item-'+color[index]).style.height = size.toString() + 'px';
			document.getElementById('side-item-'+color[index]).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('side-item-'+color[index]).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('side-item-'+color[index]).style.fontSize = (size - 3).toString() + 'px';

		}
		else if ( selected_elevation2 == undefined || Math.abs( selected_elevation_degree2 - current_index_degree2 ) > 5 ) {
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

var frontGeometry = new THREE.TorusGeometry(15,0.1,30,100);
var frontMaterial = new THREE.MeshLambertMaterial({
	color: 0x808000
});
var front = new THREE.Mesh(frontGeometry, frontMaterial);
front.position.set(0,0,0);


var sideGeometry = new THREE.TorusGeometry(15,0.1,30,100);
var sideMaterial = new THREE.MeshLambertMaterial({
	color: 0x964b00
});
var side = new THREE.Mesh(sideGeometry, sideMaterial);
side.rotation.y = Math.PI / 2;


var headGeometry = new THREE.TorusGeometry(15,0.1,30,100);
var headMaterial = new THREE.MeshLambertMaterial({
	color: 0x6a0dad
});
var head = new THREE.Mesh(headGeometry, headMaterial);
head.rotation.x = Math.PI / 2;

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
scene.add(head);
scene.add(side);
scene.add(front);
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