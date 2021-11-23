window.addEventListener('load',loadFrontImg,false);
window.addEventListener('load',loadSideImg,false);
window.addEventListener('load',loadHeadImg,false);

let currentAnnotation = 1;
let totalAnnotation = 3;

/* Annotation */
let source_count = new Array(totalAnnotation);

/* Interaction */
let action_type = undefined;
let value = undefined;
let timestamp = undefined;

/* Location */
let azimuth = new Array();
let elevation = new Array();

document.getElementById('audio').addEventListener("ended",displaySelection);
document.getElementById('count').addEventListener("change",addSourceCount);
/* after the user enters the location --> NEXT SOURCE button will display */


var side = document.getElementById("side").onmousedown = getCoordinatesSide;
function getCoordinatesSide(e){
	if (!e) var e = window.event;
}

var front = document.getElementById("front").onmousedown = getCoordinatesFront;
function getCoordinatesFront(e){
	if (!e) var e = window.event;

	var curr_elevation = 220 - e.offsetY;

	/* These two events should be associated with key-board change */

	/* if one needs to add elevation */
	var result = addElevation(curr_elevation);
	if (result){
		var ctx = document.getElementById("front").getContext("2d");
		drawCoordinates(ctx, e.offsetX,e.offsetY);
	}

	if ((azimuth[input_count-1] != undefined) && (elevation[input_count-1] != undefined)){
		document.getElementById('btn-button-next').setAttribute('style','');
	}

	/* if one needs to delete elevation */
	/* deleteElevation() */
}

var head = document.getElementById("head").onmousedown = getCoordinatesHead;
function getCoordinatesHead(e){
	if (!e) var e = window.event;
	var curr_azimuth = -1;

	if (e.offsetX>110 && e.offsetY<110){ /* Quadrant 1 */
		var x = e.offsetX - 110;
		var y = 110 - e.offsetY;
		arccosine = Math.acos(y / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI));
	}
	else if (e.offsetX>110 && e.offsetY>110){ /* Quadrant 2 */
		var x = e.offsetX - 110;
		var y = e.offsetY - 110;
		arccosine = Math.acos(x / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+90;
	}
	else if (e.offsetX < 110 && e.offsetY > 110){ /* Quadrant 3 */
		var x = 110 - e.offsetX;
		var y = 110 - e.offsetY;
		arccosine = Math.acos(x / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = 270 - Math.round(arccosine * (180/Math.PI));
	}
	else{ /* Quadrant 4 */
		var x = 110 - e.offsetX;
		var y = e.offsetY - 110;
		arccosine = Math.acos(x / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+270;
	}

	/* These two events should be associated with key-board change */

	/* if one needs to add azimuth */
	var result = addAzimuth(curr_azimuth);
	if (result){
		var ctx = document.getElementById("head").getContext("2d");
		drawCoordinates(ctx, e.offsetX,e.offsetY);
	}

	if ((azimuth[input_count-1] != undefined) && (elevation[input_count-1] != undefined)){
		document.getElementById('btn-button-next').setAttribute('style','');
	}

	/* if one needs to delete azimuth */
	/* deleteAzimuth() */
}

function addAzimuth(curr_azimuth){
	input_count = document.getElementById('count').value;
	let index = 0;
	while (index < input_count){
		if (azimuth[index] == curr_azimuth){
			window.alert("You have already entered this azimuth");
			return false;
		}
		else if (azimuth[index] == undefined){
			azimuth[index] = curr_azimuth;
			action_type = "azimuth";
			value = curr_azimuth;
			timestamp = Date.now();
			ajax_interaction();
			return true;
		}
		else if (index == input_count-1 && (azimuth[index] != curr_azimuth)){
			window.alert("You have already entered "+input_count+" azimuth sources");
			return false;
		}
		index += 1;
	}
}

function addElevation(curr_elevation){
	input_count = document.getElementById('count').value;
	let index = 0;
	while (index < input_count){
		if (elevation[index] == curr_elevation){
			window.alert("You have already entered this elevation");
			return false;
		}
		else if (elevation[index] == undefined){
			elevation[index] = curr_elevation;
			action_type = "elevation";
			value = curr_elevation;
			timestamp = Date.now();
			ajax_interaction();
			return true;
		}
		else if (index == input_count-1 && (elevation[index] != curr_elevation)){
			window.alert("You have already entered "+input_count+" elevation sources");
			return false;
		}
		index += 1;
	}
}

function deleteAzimuth(){
	input_count = document.getElementById('count').value;
	let index = 0;
	if (azimuth[index] == undefined){
		window.alert("You have not entered any azimuth source");
	}
	else{
		while (index < input_count){
			if (azimuth[index] == undefined){
				azimuth[index-1] = undefined;
				break;
			}
			index += 1;
		}
	}
}

function deleteElevation(){
	input_count = document.getElementById('count').value;
	let index = 0;
	if (elevation[index] == undefined){
		window.alert("You have not entered any elevation source");
	}
	else{
		while (index < input_count){
			if (elevation[index] == undefined){
				elevation[index-1] = undefined;
				break;
			}
			index += 1;
		}
	}
}

function drawCoordinates(ctx,x,y){
	ctx.fillStyle = "#0000FF";
	ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
}

function addSourceCount(){
	/* Annotation */
	source_count[currentAnnotation-1] = document.getElementById('count').value;

	/* Interaction */
	action_type = "source count";
	value = document.getElementById('count').value;
	timestamp = Date.now();
	ajax_interaction();
	azimuth = new Array();
	loadHeadImg();
	loadFrontImg();
	loadSideImg();

	/* display 2d images */
	document.getElementById('2d-question').innerHTML="Please identify the location of each source:";
	document.getElementById('2d').setAttribute('style','');
}

function displaySelection(){
	document.getElementById('count').setAttribute('style','');
}

function setNextQuestion(){
	if (document.getElementById('count').value == undefined){
		window.alert("You must select a response");
		return;
	}

	ajax_location(); /* send location to the back-end */

	loadHeadImg();
	loadFrontImg();
	loadSideImg();

	currentAnnotation++;
	if (currentAnnotation == totalAnnotation){
		document.getElementById('btn-button-submit').setAttribute('style','');
		document.getElementById('btn-button-next').style.display='none';
	}

	let listen = 'Listen to the audio ['+currentAnnotation+' / 3]';
	let audio_source = 'templates/assets/audio/test'+currentAnnotation+'.wav';
	document.getElementsByTagName('h2')[0].innerHTML=listen;
	document.getElementById('count').style.display='none';
	document.getElementById('default-option').selected=true;

	var audio = document.getElementById('audio');
	var source = document.getElementById('source');
	source.src = audio_source;
	audio.load();
}

function ajax_annotation(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/annotation', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({source_count});
	req.send(data);
}

function ajax_interaction(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/interaction', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({currentAnnotation,action_type,value,timestamp});
	req.send(data);
}

function ajax_location(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/location', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({currentAnnotation,azimuth,elevation});
	req.send(data);
	azimuth = new Array();
	elevation = new Array();
}

/* load front background-image to canvas*/
function loadFrontImg(){
	var image = document.getElementById("front-img");
	var frontCanvas = document.getElementById('front');
	var ctx = frontCanvas.getContext('2d');
	ctx.drawImage(image,0,0,220,220);
}

/* load side background-image to canvas*/
function loadSideImg(){
	var image = document.getElementById("side-img");
	var sideCanvas = document.getElementById('side');
	var ctx = sideCanvas.getContext('2d');
	ctx.drawImage(image,0,0,220,220);
}

/* load head background-image to canvas*/
function loadHeadImg(){
	var image = document.getElementById("head-img");
	var headCanvas = document.getElementById('head');
	var ctx = headCanvas.getContext('2d');
	ctx.drawImage(image,0,0,220,220);
}