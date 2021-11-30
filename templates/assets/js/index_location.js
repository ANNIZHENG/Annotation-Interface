var side = document.getElementById("side").onmousedown = getCoordinatesSide;
function getCoordinatesSide(e){
	if (!e) var e = window.event;

	var curr_elevation = 180 - e.offsetY;
	var posX = e.offsetX;
	var result = addElevation(curr_elevation,posX);
	if (result){
		var ctx = document.getElementById("side").getContext("2d");
		elevation_index += 1;
	}
	if ((azimuth[input_count-1] != undefined) 
	&& (elevation[input_count-1] != undefined) && !last_question){
		document.getElementById('btn-button-next').setAttribute('style','');
	}
	else if ((azimuth[input_count-1] != undefined) 
	&& (elevation[input_count-1] != undefined) && last_question){
		document.getElementById('btn-button-submit').setAttribute('style','');
	}
}

var front = document.getElementById("front").onmousedown = getCoordinatesFront;
function getCoordinatesFront(e){
	if (!e) var e = window.event;

	var curr_elevation = 180 - e.offsetY;
	var posX = e.offsetX;

	var result = addElevation(curr_elevation,posX);
	if (result){
		var ctx = document.getElementById("front").getContext("2d");
		elevation_index += 1;
	}
	if ((azimuth[input_count-1] != undefined) 
	&& (elevation[input_count-1] != undefined) && !last_question){
		document.getElementById('btn-button-next').setAttribute('style','');
	}
	else if ((azimuth[input_count-1] != undefined) 
	&& (elevation[input_count-1] != undefined) && last_question){
		document.getElementById('btn-button-submit').setAttribute('style','');
	}
}

var head = document.getElementById("head").onmousedown = getCoordinatesHead;
function getCoordinatesHead(e){
	if (!e) var e = window.event;
	var curr_azimuth = -1;

	if (e.offsetX>90 && e.offsetY<90){ // Quadrant 1
		var x = e.offsetX - 90;
		var y = 90 - e.offsetY;
		arccosine = Math.acos(y / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI));
	}
	else if (e.offsetX>90 && e.offsetY>90){ // Quadrant 2
		var x = e.offsetX - 90;
		var y = e.offsetY - 90;
		arccosine = Math.acos(x / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+90;
	}
	else if (e.offsetX < 90 && e.offsetY > 90){ // Quadrant 3
		var x = 90 - e.offsetX;
		var y = 90 - e.offsetY;
		arccosine = Math.acos(x / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = 270 - Math.round(arccosine * (180/Math.PI));
	}
	else{ // Quadrant 4
		var x = 90 - e.offsetX;
		var y = e.offsetY - 90;
		arccosine = Math.acos(x / (Math.sqrt(Math.pow(x,2) + Math.pow(y,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+270;
	}

	var result = addAzimuth(curr_azimuth);
	if (result){
		var ctx = document.getElementById("head").getContext("2d");
		azimuth_index += 1;
	}

	if ((azimuth[input_count-1] != undefined) 
	&& (elevation[input_count-1] != undefined) && !last_question){
		document.getElementById('btn-button-next').setAttribute('style','');
	}
	else if ((azimuth[input_count-1] != undefined) 
	&& (elevation[input_count-1] != undefined) && last_question){
		document.getElementById('btn-button-submit').setAttribute('style','');
	}
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

function addElevation(curr_elevation,posX){
	input_count = document.getElementById('count').value;
	let index = 0;
	while (index < input_count){
		if ((elevation[index] == curr_elevation) && (elevation_posX[index] == posX)){
			window.alert("You have already entered this elevation");
			return false;
		}
		else if (elevation[index] == undefined){
			elevation[index] = curr_elevation;
			elevation_posX[index] = posX;
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