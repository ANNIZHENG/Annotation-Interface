// used to determine which question user is at
var annotation_id = 1;
const totalAnnotation = 3;

// Location
var save_long = 0;
var save_lat = 0;
var curr_azimuth = 0;
var curr_elevation = 0;
var azimuth = new Array();
var elevation = new Array();

// reach to the last question?
var last_question = false;

// Annotation
var source_count = 0;

// Interaction
var action_type = undefined;
var value = undefined;
var timestamp = undefined;

// Colors
var colors = [0x009dff, 0xff7f0e, 0x00ff00, 
	0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];

/* container.2d.user interface */

document.getElementById('audio').addEventListener("ended",displaySelection);
document.getElementById('audio').addEventListener("playing",addPlaying);
document.getElementById('count').addEventListener("change",addSourceCount);
document.getElementById('message').addEventListener("click",popRules);

function popRules(){
	window.alert("ctrl+H for adding head location(azimuth)\nctrl+F for adding front location (elevation)\nctrl+S for adding side location (elevation)\n\nshift+H for deleting head location (azimuth)\nshift+F for deleting front location (elevation)\nshift+S for deleting side location (elevation)");
}

function addSourceCount(){
	document.getElementById('2d-question').innerHTML="Please identify the location of each source:";

	// this is for the first enter
	document.getElementById('head').setAttribute('style',"background-image: url('/templates/img/head.png');");
	document.getElementById('front').setAttribute('style',"background-image: url('/templates/img/front.png'); display: inline-block;");
	document.getElementById('side').setAttribute('style',"background-image: url('/templates/img/side.png'); display: inline-block;");

	// display button after showing the image;
	displayButton();

	source_count = document.getElementById('count').value;

	// Interaction - Source Count
	action_type = "source count";
	value = document.getElementById('count').value;
	timestamp = Date.now();
	ajax_interaction();

	// reset all location elements
	azimuth = new Array();
	elevation = new Array();
	reloadAll();
}

function addPlaying(){
	// Interaction - Audio
	action_type = "play audio";
	value = null;
	timestamp = Date.now();
	ajax_interaction();
}

function displaySelection(){
	// if user listened to audio; then show source count dropdown
	document.getElementById('count').setAttribute('style','');
}

function displayButton(){
	if (!last_question) document.getElementById('btn-button-next').setAttribute('style','');
	else document.getElementById('btn-button-submit').setAttribute('style','');
}

function setNextQuestion(){
	// if user not enter enough annotation -> ask whether or not to proceed 
	var proceed = askProceed(); 
	if (!proceed) return false;
	if (!ajax_next()) return false; // update locations and source count to database

	annotation_id += 1; // increment current question number

	// when reaching to the last question
	if (annotation_id == totalAnnotation) last_question = true;

	var listen = 'Listen to the audio ['+ annotation_id +' / 3]';
	var audio_source = '/templates/assets/audio/test'+annotation_id+'.wav';
	document.getElementsByTagName('h2')[0].innerHTML=listen;
	document.getElementById('default-option').selected=true;

	// do not display questions yet
	document.getElementById('2d-question').innerHTML=''; // no asking for selection
	document.getElementById('count').style.display='none'; // no dropdown 
	document.getElementById('btn-button-next').style.display='none'; // no next button

	// do not display images yet
	document.getElementById("head").style.display='none';
	document.getElementById("front").style.display='none';
	document.getElementById("side").style.display='none';
	reloadAll();

	// load new audio
	var audio = document.getElementById('audio');
	var source = document.getElementById('source');
	source.src = audio_source;
	audio.load();
	
	return true;
}

function askProceed(){
	if (document.getElementById('count').value == undefined){
		window.alert("You must select a response");
		return false;
	}
	var index = 0;
	var acount = 0;
	var ecount = 0;
	while (index < source_count){
		if (azimuth[index] != undefined){
			acount += 1;
		}
		if (elevation[index] != undefined){
			ecount += 1;
		}
		if (azimuth[index] == undefined || elevation[index] == undefined){
			window.alert("You have to annotate both azimuth and elevation"); 
			return false;
		}
		both = 0;
		index += 1;
	}
	if (acount == 0){
		window.alert("You have to annotate at least one location");
		return false;
	}
	if (acount < source_count){
		if (confirm("You haven't annotated all sources. Do you still want to proceed?")) return true;
		else return false;
	}
	return true;
}

function ajax_interaction(){
	console.log("ACTION TYPE: "+action_type);
	var req = new XMLHttpRequest(); 
	req.open('POST', '/interaction', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({annotation_id,action_type,value,timestamp});
	req.send(data);
}

function ajax_next(){
	if (last_question){
		if (!askProceed()){
			event.preventDefault();
			return false;
		}
	}
	var req = new XMLHttpRequest(); 
	req.open('POST', '/next', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({annotation_id,azimuth,elevation,source_count});
	req.send(data);
	azimuth = new Array();
	elevation = new Array();
	return true;
}

/* container.2d.location */
var del = false; // used to suppress item.onmousedown event listener while deleting

function dragElement(index,indicator,add_index) {
	var item, inner_item, frame;

	if (indicator == 0){
		item = document.getElementById('circular'+index);
		inner_item = document.getElementById('head-item-'+index);
		frame = document.getElementById('head');
	}
	else if (indicator == 1){
		item = document.getElementById('circularF'+index);
		inner_item = document.getElementById('front-item-'+index);
		frame = document.getElementById('front');
	}
	else{
		item = document.getElementById('circularS'+index);
		inner_item = document.getElementById('side-item-'+index);
		frame = document.getElementById('side');
	}

	item.onmousedown = function (e) {
   		document.onmousemove = mouse;
		document.onmouseup = function (e) {
			if (!del){
				if(indicator == 0){
					azimuth[add_index] = curr_azimuth;
					value = curr_azimuth;
					timestamp = Date.now(); // TODO checkRepeat
				}
				else{
					elevation[add_index] = curr_elevation;
					value = curr_elevation;
					timestamp = Date.now(); // TODO checkRepeat
				}

				if (elevation[add_index] != undefined) save_lat = elevation[add_index];
				else save_lat = 96;
				if (azimuth[add_index] != undefined) save_long = azimuth[add_index];
				else save_long = 0;
				displayBall(save_long, save_lat, index);
				ajax_interaction();
			}
			document.getElementById('body').style.cursor = 'default';
			document.onmouseup = null;
			document.onmousemove = null;
			del = false;
		}
	}
	function mouse(e) {
		var flocation = frame.getBoundingClientRect();
		var innerlocation = inner_item.getBoundingClientRect();
		var ilocation = item.getBoundingClientRect();
		var cx = (ilocation.right + ilocation.left)/2;
		var cy = (ilocation.top + ilocation.bottom)/2;
		calculateAzimuth(e.pageX,e.pageY,cx,cy);
		curr_elevation = parseInt(flocation.bottom - innerlocation.top);
		item.style.transform = 'rotate('+curr_azimuth+'deg)';
	}
}

function calculateAzimuth(x,y,cx,cy){
	var newx, newy;
	if ( x>cx && y<cy ){
		newx = x - cx;
		newy = cy - y;
		arccosine = Math.acos(newy / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI));
	}
	else if ( x>cx && y>cy ){
		newx = x - cx;
		newy = y - cy;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+90;
	}
	else if ( x < cx && y > cy ){
		newx = cx - x;
		newy = cy - y;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = 270 - Math.round(arccosine * (180/Math.PI));
	}
	else{
		newx = cx - x;
		newy = y - cy;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+270;
	}
}

// adding dots (command for adding and option/Alt (keycode 18) for deleting)
document.addEventListener("keydown", keyboardEvent, false);

var delete_head,delete_front,delete_side = false;

function keyboardEvent(e){
	if (e.ctrlKey && e.which == 72){ // Add Head
		// document.getElementById('head').addEventListener('click', function (e){ /* all functions here */ });

		delete_head,delete_front,delete_side = false;

		var find_undefined = false
		var temp_azimuth_index = 0;
		var index = 0;
		var acount = 0;
		while (index < source_count){
			if (azimuth[index] == undefined && !find_undefined){
				temp_azimuth_index = index+1;
				find_undefined = true;
			}
			if (azimuth[index] != undefined) {acount += 1;}
			index += 1;
		}
		if (acount == source_count){
			window.alert("You have already enter " + source_count + " azimuth elements");
			return;
		}

		document.getElementById('body').style.cursor = 'cell'; // change cursor shape

		frame = document.getElementById('head');
		item = document.getElementById('circular'+temp_azimuth_index);
		item.setAttribute('style',''); // display item
		inner_item = document.getElementById('head-item-'+temp_azimuth_index);
		ilocation = item.getBoundingClientRect();
		cx = (ilocation.right + ilocation.left)/2;
		cy = (ilocation.top + ilocation.bottom)/2;

		document.addEventListener("click",function (e){

			xdistance = Math.abs(e.pageX-cx);
			ydistance = Math.abs(e.pageY-cy);

			if (xdistance < 90 && ydistance < 90){
				calculateAzimuth(e.pageX,e.pageY,cx,cy);
				azimuth[temp_azimuth_index-1] = curr_azimuth;
				inner_item.setAttribute('style','');
				item.style.transform = 'rotate('+curr_azimuth+'deg)';

				if (elevation[temp_azimuth_index-1] != undefined) save_lat = elevation[temp_azimuth_index-1];
				else save_lat = 96;
				if (azimuth[temp_azimuth_index-1] != undefined) save_long = azimuth[temp_azimuth_index-1];
				else save_long = 0;
				displayBall(save_long, save_lat, temp_azimuth_index);

				// ajax
				action_type = "azimuth";
				value = curr_azimuth;
				timestamp = Date.now();
				ajax_interaction();
			}
			document.getElementById('body').style.cursor = 'default';
		}, {once: true});
	}
	else if (e.ctrlKey && e.which == 70){ // Add Front
		// document.getElementById('front').addEventListener('click', function (e){ /* all functions here */ });

		delete_head,delete_front,delete_side = false;

		var find_undefined = false
		var temp_elevation_index = 0;
		var index = 0;
		var ecount = 0;
		while (index < source_count){
			if (elevation[index] == undefined && !find_undefined){
				temp_elevation_index = index+1;
				find_undefined = true;
			}
			if (elevation[index] != undefined) {ecount += 1;}
			index += 1;
		}
		if (ecount == source_count){
			window.alert("You have already enter " + source_count + " elevation elements");
			return;
		}

		document.getElementById('body').style.cursor = 'cell'; // change cursor shape

		frame = document.getElementById('front');
		item = document.getElementById('circularF'+temp_elevation_index);
		item.setAttribute('style',''); // display item
		inner_item = document.getElementById('front-item-'+temp_elevation_index);
		ilocation = item.getBoundingClientRect();
		cx = (ilocation.right + ilocation.left)/2;
		cy = (ilocation.top + ilocation.bottom)/2;

		document.addEventListener("click",function (e){

			xdistance = Math.abs(e.pageX-cx);
			ydistance = Math.abs(e.pageY-cy);

			if (xdistance < 90 && ydistance < 90){
				// locate the element first
				calculateAzimuth(e.pageX,e.pageY,cx,cy);
				inner_item.setAttribute('style','');
				item.style.transform = 'rotate('+curr_azimuth+'deg)';

				// calculate current elevation
				flocation = frame.getBoundingClientRect();
				innerlocation = inner_item.getBoundingClientRect();
				curr_elevation = parseInt(flocation.bottom - innerlocation.top);
				elevation[temp_elevation_index-1] = curr_elevation;

				if (elevation[temp_elevation_index-1] != undefined) save_lat = elevation[temp_elevation_index-1];
				else save_lat = 96;
				if (azimuth[temp_elevation_index-1] != undefined) save_long = azimuth[temp_elevation_index-1];
				else save_long = 0;
				displayBall(save_long, save_lat, temp_elevation_index);

				// ajax
				action_type = "elevation";
				value = curr_elevation;
				timestamp = Date.now();
				ajax_interaction();
			}
			document.getElementById('body').style.cursor = 'default';
		},  {once: true});
	}
	else if (e.ctrlKey && e.which == 83){ // Add Side
		// document.getElementById('side').addEventListener('click', function (e){ /* all functions here */ });
		delete_head,delete_front,delete_side = false;

		var find_undefined = false
		var temp_elevation_index = 0;
		var index = 0;
		var ecount = 0;
		while (index < source_count){
			if (elevation[index] == undefined && !find_undefined){
				temp_elevation_index = index+1;
				find_undefined = true;
			}
			if (elevation[index] != undefined) {ecount += 1;}
			index += 1;
		}
		if (ecount == source_count){
			window.alert("You have already enter " + source_count + " elevation elements");
			return;
		}

		// change cursor shape
		document.getElementById('body').style.cursor = 'cell';

		frame = document.getElementById('side');
		item = document.getElementById('circularS'+temp_elevation_index);
		item.setAttribute('style',''); // display item
		inner_item = document.getElementById('side-item-'+temp_elevation_index);
		ilocation = item.getBoundingClientRect();
		cx = (ilocation.right + ilocation.left)/2;
		cy = (ilocation.top + ilocation.bottom)/2;

		document.addEventListener("click",function (e){

			xdistance = Math.abs(e.pageX-cx);
			ydistance = Math.abs(e.pageY-cy);

			if (xdistance < 90 && ydistance < 90){
				// locate the element first
				calculateAzimuth(e.pageX,e.pageY,cx,cy);
				inner_item.setAttribute('style','');
				item.style.transform = 'rotate('+curr_azimuth+'deg)';

				// calculate current elevation
				flocation = frame.getBoundingClientRect();
				innerlocation = inner_item.getBoundingClientRect();
				curr_elevation = parseInt(flocation.bottom - innerlocation.top);
				elevation[temp_elevation_index-1] = curr_elevation;

				if (elevation[temp_elevation_index-1] != undefined) save_lat = elevation[temp_elevation_index-1];
				else save_lat = 96;
				if (azimuth[temp_elevation_index-1] != undefined) save_long = azimuth[temp_elevation_index-1];
				else save_long = 0;
				displayBall(save_long, save_lat, temp_elevation_index);

				// ajax
				action_type = "elevation";
				value = curr_elevation;
				timestamp = Date.now();
				ajax_interaction();
			}
			document.getElementById('body').style.cursor = 'default';
		},  {once: true});
	}
	else if (e.shiftKey && e.which == 72){ // Delete Head
		var index = 0;
		var acount = 0;
		while (index < azimuth.length) {
			if (azimuth[index] != undefined) acount += 1;
			index += 1;
		}
		if (acount == 0){
			window.alert("There is no azimuth element");
			return;
		}
		else{
			document.getElementById('body').style.cursor = "url('/templates/img/minus.svg'),auto";
			document.onmousedown = function(e){
				document.getElementById('body').style.cursor = 'default';
				delete_head = false;
			}
			delete_head = true;
			del = true;
		}
	}
	else if (e.shiftKey && e.which == 70){ // Delete Front
		var index = 0;
		var ecount = 0;
		while (index < elevation.length) {
			if (elevation[index] != undefined) ecount += 1;
			index += 1;
		}
		if (ecount == 0){
			window.alert("There is no elevation element");
			return;
		}
		else{
			document.getElementById('body').style.cursor = "url('/templates/img/minus.svg'),auto";
			document.onmousedown = function(e){
				document.getElementById('body').style.cursor = 'default';
				delete_head = false;
			}
			delete_front = true;
			del = true;
		}
	}
	else if (e.shiftKey && e.which == 83){ // Delete Side
		var index = 0;
		var ecount = 0;
		while (index < elevation.length) {
			if (elevation[index] != undefined) ecount += 1;
			index += 1;
		}
		if (ecount == 0){
			window.alert("There is no elevation element");
			return;
		}
		else{
			document.getElementById('body').style.cursor = "url('/templates/img/minus.svg'),auto";
			document.onmousedown = function(e){
				document.getElementById('body').style.cursor = 'default';
				delete_head = false;
			}
			delete_side = true;
			del = true;
		}
	}
	console.log("azimuth: "+azimuth.toString());
	console.log("elevation: "+elevation.toString());
}

function reloadAll(){
	var index = 0;
	while (index < 10){
		document.getElementById('head-item-'+(index+1)).style.display = 'none';
		document.getElementById('front-item-'+(index+1)).style.display = 'none';
		document.getElementById('side-item-'+(index+1)).style.display = 'none';
		index += 1;
	}
	removeAllBalls();
}

document.getElementById('head-item-1').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[0] = undefined;
		elevation[0] = undefined;

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		deleteBall(1);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(1,0,0);
});
document.getElementById('head-item-2').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[1] = undefined;
		elevation[1] = undefined;

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		deleteBall(2);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(2,0,1);
});
document.getElementById('head-item-3').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[2] = undefined;
		elevation[2] = undefined;

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		deleteBall(3);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(3,0,2);
});
document.getElementById('head-item-4').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[3] = undefined;
		elevation[3] = undefined;

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		deleteBall(4);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(4,0,3);
});
document.getElementById('head-item-5').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[4] = undefined;
		elevation[4] = undefined;

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		deleteBall(5);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(5,0,4);
});
document.getElementById('head-item-6').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[5] = undefined;
		elevation[5] = undefined;

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		deleteBall(6);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(6,0,5);
});
document.getElementById('head-item-7').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[6] = undefined;
		elevation[6] = undefined;

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		deleteBall(7);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(7,0,6);
});
document.getElementById('head-item-8').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[7] = undefined;
		elevation[7] = undefined;

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		deleteBall(8);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(8,0,7);
});
document.getElementById('head-item-9').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[8] = undefined;
		elevation[8] = undefined;

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		deleteBall(9);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(9,0,8);
});
document.getElementById('head-item-10').addEventListener("mousedown",function(){
	if (delete_head){
		azimuth[9] = undefined;
		elevation[9] = undefined;

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		deleteBall(10);

		delete_head = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(10,0,9);
});

document.getElementById('front-item-1').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[0] = undefined;
		elevation[0] = undefined;

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		deleteBall(1);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(1,1,0);
});
document.getElementById('front-item-2').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[1] = undefined;
		elevation[1] = undefined;

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		deleteBall(2);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(2,1,1);
});
document.getElementById('front-item-3').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[2] = undefined;
		elevation[2] = undefined;

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		deleteBall(3);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(3,1,2);
});
document.getElementById('front-item-4').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[3] = undefined;
		elevation[3] = undefined;

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		deleteBall(4);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(4,1,3);
});
document.getElementById('front-item-5').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[4] = undefined;
		elevation[4] = undefined;

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		deleteBall(5);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(5,1,4);
});
document.getElementById('front-item-6').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[5] = undefined;
		elevation[5] = undefined;

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		deleteBall(6);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(6,1,5);
});
document.getElementById('front-item-7').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[6] = undefined;
		elevation[6] = undefined;

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		deleteBall(7);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(7,1,6);
});
document.getElementById('front-item-8').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[7] = undefined;
		elevation[7] = undefined;

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		deleteBall(8);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(8,1,7);
});
document.getElementById('front-item-9').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[8] = undefined;
		elevation[8] = undefined;

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		deleteBall(9);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(9,1,8);
});
document.getElementById('front-item-10').addEventListener("mousedown",function(){
	if (delete_front){
		azimuth[9] = undefined;
		elevation[9] = undefined;

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		deleteBall(10);

		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(10,1,9);
});

document.getElementById('side-item-1').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[0] = undefined;
		elevation[0] = undefined;

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		deleteBall(1);
		
		delete_front = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(1,2,0);
});
document.getElementById('side-item-2').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[1] = undefined;
		elevation[1] = undefined;

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		deleteBall(2);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(2,2,1);
});
document.getElementById('side-item-3').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[2] = undefined;
		elevation[2] = undefined;

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		deleteBall(3);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(3,2,2);
});
document.getElementById('side-item-4').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[3] = undefined;
		elevation[3] = undefined;

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		deleteBall(4);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(4,2,3);
});
document.getElementById('side-item-5').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[4] = undefined;
		elevation[4] = undefined;

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		deleteBall(5);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(5,2,4);
});
document.getElementById('side-item-6').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[5] = undefined;
		elevation[5] = undefined;

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		deleteBall(6);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(6,2,5);
});
document.getElementById('side-item-7').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[6] = undefined;
		elevation[6] = undefined;

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		deleteBall(7);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(7,2,6);
});
document.getElementById('side-item-8').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[7] = undefined;
		elevation[7] = undefined;

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		deleteBall(8);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(8,2,7);
});
document.getElementById('side-item-9').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[8] = undefined;
		elevation[8] = undefined;

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		deleteBall(9);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(9,2,8);
});
document.getElementById('side-item-10').addEventListener("mousedown",function(){
	if (delete_side){
		azimuth[9] = undefined;
		elevation[9] = undefined;

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		deleteBall(10);

		delete_side = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(10,2,9);
});

/* container.3d */

/* set up */
container = document.getElementById('3d-head');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
var light = new THREE.HemisphereLight(0xffffff, 0.8);
scene.add(light);

var pointLight = new THREE.PointLight(0xffffff, 0.7);
pointLight.position.set(50, 30, 200);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 30;

/* geometry */

var sphereGeometry = new THREE.SphereGeometry(8,60,30);
var sphereMaterial = new THREE.MeshLambertMaterial({
	map: new THREE.TextureLoader().load('/templates/img/face.png'),
	color: 0xefd8c3
});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0,0,0);

var ear1Geometry = new THREE.SphereGeometry(2,60,30);
var ear1Material = new THREE.MeshLambertMaterial({
	color: 0xc2a68b
});
var ear1 = new THREE.Mesh(ear1Geometry, ear1Material);
ear1.position.set(8,0,0);

var ear2Geometry = new THREE.SphereGeometry(2,60,30);
var ear2Material = new THREE.MeshLambertMaterial({
	color: 0xc2a68b
});
var ear2 = new THREE.Mesh(ear2Geometry, ear2Material);
ear2.position.set(-8,0,0);

var noseGeometry = new THREE.SphereGeometry(0.8,60,30);
var noseMaterial = new THREE.MeshLambertMaterial({
	color: 0xc2a68b
});
var nose = new THREE.Mesh(noseGeometry, noseMaterial);
nose.position.set(0,0,8);

var frameGeometry = new THREE.SphereBufferGeometry(15,20,20);
var frameMaterial = new THREE.MeshLambertMaterial({});
var frame = new THREE.Mesh(frameGeometry, frameMaterial);
var edgesGeometry = new THREE.EdgesGeometry(frameGeometry);
var wireframe = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({color: 0x0000ff})); 


/* balls to be added*/
var ballGeometry;
var ballMaterial;

function toRadian(angle){
	return angle * Math.PI / 180;
}

// https://gist.github.com/jhermsmeier/72626d5fd79c5875248fd2c1e8162489
function polarToCartesian(lon, lat, radius) {
	var phi = ( 90 - lat ) * Math.PI / 180
	var theta = ( lon + 180 ) * Math.PI / 180
	return {
	  x: -(radius * Math.sin(phi) * Math.sin(theta)),
	  y: radius * Math.cos(phi),
	  z: radius * Math.sin(phi) * Math.cos(theta),
	}
}

function displayBall(azimuth, tilt, number){
	azimuth = azimuth - 180;
	if (tilt > 96) tilt = (tilt - 96) * 1.11;
	else if (tilt < 96) tilt = (tilt - 96) * 1.13;
	else tilt = 0;
	var returnlist = polarToCartesian(azimuth, tilt, 15);
	ballGeometry = new THREE.SphereGeometry(0.8,60,30);
	ballMaterial = new THREE.MeshLambertMaterial({
		color: colors[number-1]
	});
	var ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.name = 'ball'+number;
	ball.position.set(returnlist['x'], returnlist['y'], returnlist['z']);
	scene.remove(scene.getObjectByName('ball'+number));
	scene.add(ball);
}

function deleteBall(number){
	scene.remove(scene.getObjectByName('ball'+number));
}

function removeAllBalls(){
	var index = 0;
	while (index < 10){
		scene.remove(scene.getObjectByName('ball'+(index + 1)));
		index += 1;
	}
}

/* display 3d */
scene.add(wireframe);
scene.add(sphere);
scene.add(ear1);
scene.add(ear2);
scene.add(nose);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500,500);
container.appendChild(renderer.domElement);

camera.lookAt(sphere.position);

controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 500;

function animate(){
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene,camera); 
}
animate();