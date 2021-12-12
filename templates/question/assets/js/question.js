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

// reach to the last question
var last_question = false;

// Annotation
var source_count = 0;

// Interaction
var action_type = undefined;
var value = undefined;
var timestamp = undefined;

// colors
var colors = [0x009dff, 0xff7f0e, 0x00ff00, 
	0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];

/* container.2d.user interface */

document.getElementById('audio').addEventListener("ended",displaySelection);
document.getElementById('audio').addEventListener("playing",addPlaying);
document.getElementById('count').addEventListener("change",addSourceCount);
document.getElementById('message').addEventListener("click",popRules);

function popRules(){
	window.alert("1. Please click option(Mac) or Alt(Windows) to add an annotation\n2. Please click command to delete an annotation\n3. If you need more than one view for adding elevation, please click control key (COMING SOON)");
}

function addSourceCount(){
	document.getElementById('2d-question').innerHTML = "Please identify the location of each source:";

	// this is for the first enter
	document.getElementById('head').setAttribute('style',"background-image: url('/templates/question/img/head.png');");
	document.getElementById('front').setAttribute('style',"background-image: url('/templates/question/img/front.png'); display: inline-block;");
	document.getElementById('side').setAttribute('style',"background-image: url('/templates/question/img/side.png'); display: inline-block;");

	// display button after showing the image;
	displayButton();

	source_count = document.getElementById('count').value;

	// Interaction - Source Count
	action_type = "source count";
	value = document.getElementById('count').value;
	timestamp = Date.now();
	ajax_interaction();
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
	var proceed = askProceed(); 
	if (!proceed) return false;
	if (!ajax_next()) return false;

	azimuth = new Array();
	elevation = new Array();

	annotation_id += 1;

	// when reaching to the last question
	if (annotation_id == totalAnnotation) last_question = true;

	var listen = 'Listen to the audio ['+ annotation_id +' / 3]';
	var audio_source = '/templates/question/assets/audio/test'+annotation_id+'.wav';
	document.getElementsByTagName('h2')[0].innerHTML=listen;
	document.getElementById('default-option').selected = true;

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
	// console.log("askProceed "+findUndefinedAzimuth()+", "+findUndefinedElevation());
	if (document.getElementById('count').value == undefined){ window.alert("You must select a response"); return false; }
	if (findUndefinedAzimuth() == -3 && findUndefinedElevation() == -3) { window.alert("You must annotate at least one location"); return false; }
	if (findUndefinedAzimuth() != findUndefinedElevation()) { window.alert("The number of annotated azimuth does not match with that of elevation"); return false; }
	if (findUndefinedAzimuth() == -2 || findUndefinedAzimuth() == -2) { window.alert("Your annotation number is greater than the source count you entered. Please delete some of them."); return false; }
	if (findUndefinedAzimuth() != -1 || findUndefinedElevation() != -1 ) { 
		if (confirm("You haven't annotated all sources yet. Do you still want to proceed?")) return true;
		else return false;
	}
	return true;
}

function ajax_interaction(){
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

// var del = false;
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

	original_front_degree = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));

	item.onmousedown = function (e) {
   		document.onmousemove = mouse;
		document.onmouseup = function (e) {

			if (indicator == 0){ // drag head
				if (document.getElementById('front-item-'+index).style.display != 'none'){
					degree = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));
					if ( (temp_azimuth > 180 && azimuth[add_index] < 180) || (temp_azimuth < 180 && azimuth[add_index] > 180) ){ document.getElementById('circularF'+index).style.transform = 'rotate('+(360 - degree)+'deg)'; }
				}

				displayBall(temp_azimuth-180, elevation[add_index] != undefined ? elevation[add_index] : 0, index);
				curr_azimuth = temp_azimuth;
				azimuth[add_index] = curr_azimuth;
			}
			else if (indicator == 1){ // drag front
				if (document.getElementById('head-item-'+index).style.display != 'none'){
					degree = parseInt(document.getElementById('circular'+index).style.transform.replace('rotate(','').replace('deg)',''));
					if ( (degree < 180 && temp_azimuth > 180) || (degree > 180 && temp_azimuth < 180) ){ 
						window.alert("Your BACK view annotation does not match with your FRONT view annotation");
						item.style.transform = 'rotate('+original_front_degree+'deg)';

						document.getElementById('body').style.cursor = 'default';
						document.onmouseup = null;
						document.onmousemove = null;
						return;
					}
				}
				temp_azimuth = azimuth[add_index] != undefined ? azimuth[add_index] - 180 : -180;
				displayBall(temp_azimuth, curr_elevation, index);
				elevation[add_index] = curr_elevation;
			}
			else{ // drag side
				/*
				if (temp_azimuth < 180 && azimuth[add_index] != undefined) temp_azimuth = azimuth[add_index];
				else if (temp_azimuth > 180 && azimuth[add_index] != undefined) temp_azimuth = azimuth[add_index] - 180;
				else if (azimuth[add_index] == undefined || temp_azimuth == 180) temp_azimuth = 0;
				*/
				displayBall(temp_azimuth-180, curr_elevation, index);
			}

			if(indicator == 0){
				azimuth[add_index] = curr_azimuth;
				value = curr_azimuth;
				timestamp = Date.now();
			}
			else{
				elevation[add_index] = curr_elevation;
				value = curr_elevation;
				timestamp = Date.now();
			}

			ajax_interaction();
			document.getElementById('body').style.cursor = 'default';
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	function mouse(e) {
		var flocation = frame.getBoundingClientRect();
		var innerlocation = inner_item.getBoundingClientRect();
		var ilocation = item.getBoundingClientRect();
		var cx = (ilocation.right + ilocation.left) / 2;
		var cy = (ilocation.top + ilocation.bottom) / 2;
		temp_azimuth = calculateAzimuth(e.pageX, e.pageY, cx, cy);

		if (indicator == 0){
			//curr_azimuth = temp_azimuth;
			//azimuth[add_index] = curr_azimuth;
		}
		else  {
			temp_elevation = flocation.bottom - innerlocation.top;
			if (temp_elevation == 97 || temp_elevation == 98) curr_elevation = 0;
			else if (temp_elevation >= 180) curr_elevation = 90;
			else if (temp_elevation <= 15) curr_elevation = -90;
			else if (temp_elevation > 98) curr_elevation = Math.round( temp_elevation - 98 );
			else if (temp_elevation < 97) curr_elevation = Math.round( temp_elevation - 97 );
			//elevation[add_index] = curr_elevation;
		}

		item.style.transform = 'rotate('+(temp_azimuth)+'deg)';
	}
}

function calculateAzimuth(x,y,cx,cy){
	var newx, newy;
	if ( x>cx && y<cy ){
		newx = x - cx;
		newy = cy - y;
		arccosine = Math.acos(newy / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		return Math.round(arccosine * (180 / Math.PI));
	}
	else if ( x>cx && y>cy ){
		newx = x - cx;
		newy = y - cy;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		return Math.round(arccosine * (180 / Math.PI)) + 90;
	}
	else if ( x < cx && y > cy ){
		newx = cx - x;
		newy = cy - y;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		return 270 - Math.round(arccosine * (180 / Math.PI));
	}
	else{
		newx = cx - x;
		newy = y - cy;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		return Math.round(arccosine * (180 / Math.PI)) + 270;
	}
}

/* container.2d */

var key_perform = false;

function findUndefinedAzimuth(){
	var index = 0;
	var azimuth_item_index = 0;
	var azimuth_count = 0;
	var find_undefined = false;


	var lock = 0;
	if (azimuth.length > source_count) lock = azimuth.length;
	else lock = source_count;

	while ( index < lock ){
		if ( azimuth[index] == undefined && !find_undefined ){
			azimuth_item_index = index;
			find_undefined = true;
		}
		if ( azimuth[index] != undefined ) azimuth_count += 1;
		index += 1;
	}
	if (azimuth_count == 0 && !key_perform) return -3;
	if (azimuth_count > source_count) return -2;
	if (azimuth_count == source_count) return -1;
	else return azimuth_item_index;
}

function findUndefinedElevation(){
	var index = 0;
	var elevation_item_index = 0;
	var elevation_count = 0;
	var find_undefined = false;

	var lock = 0;
	if (elevation.length > source_count) lock = elevation.length;
	else lock = source_count;

	while ( index < lock ){
		if ( elevation[index] == undefined && !find_undefined ){
			elevation_item_index = index;
			find_undefined = true;
		}
		if ( elevation_count > source_count ) return -2;
		if ( elevation[index] != undefined ) elevation_count += 1;
		index += 1;
	}
	if (elevation_count == 0 && !key_perform) return -3;
	if (elevation_count > source_count) return -2;
	if (elevation_count == source_count) return -1;
	else return elevation_item_index;
}

function calculateRadius(mouseX, mouseY, frameX, frameY){
	x = frameX - mouseX;
	y = frameY - mouseY;
	radius = Math.sqrt( Math.pow(x,2) + Math.pow(y,2) );
	if ( radius <= 87 ) return true;
	else return false;
}

var enable_head = false;
var enable_front = false;
var enable_side = false;
var delete_head = false;
var delete_front = false;
var delete_side = false;
var add_third = false;

document.addEventListener("keydown", add);
function add(e){
	key_perform = true;
	document.getElementById('circular0').setAttribute('style','');
	document.getElementById('circularF0').setAttribute('style','');
	document.getElementById('circularS0').setAttribute('style','');
	head_frameLocation = document.getElementById('circular0').getBoundingClientRect();
	front_frameLocation = document.getElementById('circularF0').getBoundingClientRect();
	side_frameLocation = document.getElementById('circularS0').getBoundingClientRect();
	head_cx = ( head_frameLocation.right + head_frameLocation.left ) / 2;
	head_cy = ( head_frameLocation.top + head_frameLocation.bottom ) / 2;
	front_cx = ( front_frameLocation.right + front_frameLocation.left ) / 2;
	front_cy = ( front_frameLocation.top + front_frameLocation.bottom ) / 2;
	side_cx = ( side_frameLocation.right + side_frameLocation.left ) / 2;
	side_cy = ( side_frameLocation.top + side_frameLocation.bottom ) / 2;

	/* Please create a refresh button here to
	if (e.ctrlKey){
		elevation_item_index = findUndefinedElevation();
		
		if ( elevation_item_index > 0 &&  ( ( document.getElementById( 'front-item-'+elevation_item_index ).style.display == 'none' ) && ( document.getElementById( 'side-item-'+elevation_item_index ).style.display == 'none' ) ) ){
			window.alert("Please enter one more elevation before adding the second annotation of that elevation");
			document.getElementById('body').style.cursor = 'default';
		}	

		if ( elevation_item_index > 0
		&&  ( ( document.getElementById( 'front-item-'+elevation_item_index ).style.display == 'none' ) || ( document.getElementById( 'side-item-'+elevation_item_index ).style.display == 'none' ) ) ){
			
			document.getElementById('body').style.cursor = 'cell';
			console.log("control key activated and the current height is: "+elevation_item_index); // Debug

			document.addEventListener('mousedown', function(e){
				enable_front = calculateRadius(e.pageX, e.pageY, front_cx, front_cy);
				enable_side = calculateRadius(e.pageX, e.pageY, side_cx, side_cy);

				if (document.getElementById('front-item-'+elevation_item_index).style.display == 'none' && enable_front){

					temp_azimuth = calculateAzimuth(e.pageX, e.pageY, front_cx, front_cy);
					document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
					document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
					document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
					itemLocation = document.getElementById('front-item-'+elevation_item_index).getBoundingClientRect();

					temp_elevation = front_frameLocation.bottom - itemLocation.top;
					if (temp_elevation == 97 || temp_elevation == 98) temp_elevation = 0;
					else if (temp_elevation >= 180) temp_elevation = 90;
					else if (temp_elevation <= 15) temp_elevation = -90;
					else if (temp_elevation > 98) temp_elevation = Math.round( temp_elevation - 98 );
					else if (temp_elevation < 97) temp_elevation = Math.round( temp_elevation - 97 );

					// console.log(temp_elevation);
					displayBall( (temp_azimuth > 180 ?  270 : 90), temp_elevation, elevation_item_index);

					elevation[elevation_item_index] = temp_elevation;
					curr_elevation = elevation[elevation_item_index];

					action_type = 'elevation';
					value = curr_elevation;
					timestamp = Date.now();
					ajax_interaction();
					
					document.getElementById('body').style.cursor = 'default';
				}
				else if (document.getElementById('side-item-'+findUndefinedElevation()).style.display == 'none' && enable_side){

					temp_azimuth = calculateAzimuth(e.pageX, e.pageY, side_cx, side_cy);
					document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
					document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
					document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
					itemLocation = document.getElementById('side-item-'+elevation_item_index).getBoundingClientRect();

					temp_elevation = side_frameLocation.bottom - itemLocation.top;
					if (temp_elevation == 97 || temp_elevation == 98) temp_elevation = 0;
					else if (temp_elevation >= 180) temp_elevation = 90;
					else if (temp_elevation <= 15) temp_elevation = -90;
					else if (temp_elevation > 98) temp_elevation = Math.round( temp_elevation - 98 );
					else if (temp_elevation < 97) temp_elevation = Math.round( temp_elevation - 97 );

					console.log(temp_elevation);
					displayBall( (temp_azimuth > 180 ?  0 : 180), temp_elevation, elevation_item_index);

					elevation[elevation_item_index] = temp_elevation;
					curr_elevation = elevation[elevation_item_index];

					action_type = 'elevation';
					value = curr_elevation;
					timestamp = Date.now();
					ajax_interaction();
					
					document.getElementById('body').style.cursor = 'default';
				}	
			},{once:true});
		}
		else{ window.alert("Please enter at least one elevation before adding the second annotation of the elevation"); document.getElementById('body').style.cursor = 'default';}
	}
	*/
	if (e.altKey){
		document.getElementById('body').style.cursor = 'cell';
		var azimuth_item_index = findUndefinedAzimuth();
		var elevation_item_index = findUndefinedElevation();

		delete_head = false; delete_front = false; delete_side = false;

		document.addEventListener('mousedown', function(e){
			enable_head = calculateRadius(e.pageX, e.pageY, head_cx, head_cy);
			enable_front = calculateRadius(e.pageX, e.pageY, front_cx, front_cy);
			enable_side = calculateRadius(e.pageX, e.pageY, side_cx, side_cy);

			if (enable_head){
				if ( azimuth_item_index == -1 ){
					window.alert("You have already enter " + source_count + " azimuth elements"); document.getElementById('body').style.cursor = 'default'; key_perform = false;
					return;
				}
				if (azimuth_item_index > elevation_item_index && elevation_item_index != -1) {
					window.alert("You must annotate an elevation"); document.getElementById('body').style.cursor = 'default'; key_perform = false;
					return;
				}

				azimuth_item_index += 1;
				curr_azimuth = calculateAzimuth(e.pageX, e.pageY, head_cx, head_cy);
				azimuth[azimuth_item_index - 1] = curr_azimuth;
				document.getElementById('circular'+azimuth_item_index).setAttribute('style','');
				document.getElementById('circular'+azimuth_item_index).style.transform = 'rotate('+curr_azimuth+'deg)';
				document.getElementById('head-item-'+azimuth_item_index).setAttribute('style','');

				displayBall(curr_azimuth - 180, (elevation[azimuth_item_index-1] != undefined ? elevation[azimuth_item_index-1] : 0) , azimuth_item_index);

				action_type = 'azimuth';
				value = curr_azimuth;
				timestamp = Date.now();
				ajax_interaction();
			}
			else if (enable_front){ // add front
				if ( elevation_item_index == -1 ){
					window.alert("You have already enter " + source_count + " elevation elements"); document.getElementById('body').style.cursor = 'default'; key_perform = false;
					return;
				}
				if (elevation_item_index > azimuth_item_index && azimuth_item_index != -1) {
					window.alert("You must annotate an azimuth"); document.getElementById('body').style.cursor = 'default'; key_perform = false;
					return;
				}

				elevation_item_index += 1;
				temp_azimuth = calculateAzimuth(e.pageX, e.pageY, front_cx, front_cy);
				if (azimuth[elevation_item_index-1] != undefined){
					if (azimuth[elevation_item_index-1] > 180 && temp_azimuth < 180) temp_azimuth = 360 - temp_azimuth;
					else if (azimuth[elevation_item_index-1] < 180 && temp_azimuth > 180) temp_azimuth = 360 - temp_azimuth;
				}

				document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
				document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
				document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
				itemLocation = document.getElementById('front-item-'+elevation_item_index).getBoundingClientRect();

				temp_elevation = front_frameLocation.bottom - itemLocation.top;
				if (temp_elevation == 97 || temp_elevation == 98) curr_elevation = 0;
				else if (temp_elevation >= 180) curr_elevation = 90;
				else if (temp_elevation <= 15) curr_elevation = -90;
				else if (temp_elevation > 98) curr_elevation = Math.round( temp_elevation - 98 );
				else if (temp_elevation < 97) curr_elevation = Math.round( temp_elevation - 97 );
				elevation[elevation_item_index-1] = curr_elevation;

				temp_azimuth = azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] - 180 : -180;
				displayBall(temp_azimuth, curr_elevation, elevation_item_index);

				action_type = 'elevation'
				value = curr_elevation
				timestamp = Date.now();
				ajax_interaction();
			}
			else if (enable_side){
				if ( elevation_item_index == -1 ){
					window.alert("You have already enter " + source_count + " elevation elements"); document.getElementById('body').style.cursor = 'default'; key_perform = false;
					return;
				}
				if (elevation_item_index > azimuth_item_index && azimuth_item_index != -1) {
					window.alert("You must annotate an azimuth"); document.getElementById('body').style.cursor = 'default'; key_perform = false;
					return;
				}

				elevation_item_index += 1;
				temp_azimuth = calculateAzimuth(e.pageX, e.pageY, side_cx, side_cy);
				console.log("temp_azimuth: "+temp_azimuth);

				if (azimuth[elevation_item_index-1] != undefined){
					if (azimuth[elevation_item_index-1] < 90 || azimuth[elevation_item_index-1] > 270){ 
						if (temp_azimuth > 180){ temp_azimuth = 360 - temp_azimuth; }
					}
					else if (azimuth[elevation_item_index-1] > 90 && azimuth[elevation_item_index-1]< 270){ 
						if (temp_azimuth < 180){ temp_azimuth = 360 - temp_azimuth; }
					}
				}
				else temp_azimuth = 0;

				document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
				document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
				document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
				itemLocation = document.getElementById('side-item-'+elevation_item_index).getBoundingClientRect();
				
				temp_elevation = side_frameLocation.bottom - itemLocation.top;
				if (temp_elevation == 97 || temp_elevation == 98) curr_elevation = 0;
				else if (temp_elevation >= 180) curr_elevation = 90;
				else if (temp_elevation <= 15) curr_elevation = -90;
				else if (temp_elevation > 98) curr_elevation = Math.round( temp_elevation - 98 );
				else if (temp_elevation < 97) curr_elevation = Math.round( temp_elevation - 97 );
				elevation[elevation_item_index-1] = curr_elevation;

				temp_azimuth = azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] - 180 : -180;
				displayBall(temp_azimuth, curr_elevation, elevation_item_index);

				action_type = 'elevation'
				value = curr_elevation
				timestamp = Date.now();
				ajax_interaction();
			}
		}, {once:true});
	}
	document.onmouseup = function(e){ document.getElementById('body').style.cursor = 'default'; }
	enable_head = false; enable_front = false; enable_side = false; key_perform = false;

	console.log("AZIMUTH: "+azimuth.toString());
	console.log("ELEVATION: "+elevation.toString());
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

document.addEventListener("keydown", function(e){
	if(e.metaKey){
		enable_head = false; enable_front = false; enable_side = false;
		document.getElementById('body').style.cursor = "url('/templates/question/img/minus.svg'), auto";
		delete_head = true;
		delete_front = true;
		delete_side = true;
	}
});

document.getElementById('head-item-1').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[0] = undefined;
		elevation[0] = undefined;

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		deleteBall(1);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(1,0,0);
});
document.getElementById('head-item-2').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[1] = undefined;
		elevation[1] = undefined;

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		deleteBall(2);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(2,0,1);
});
document.getElementById('head-item-3').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[2] = undefined;
		elevation[2] = undefined;

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		deleteBall(3);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(3,0,2);
});
document.getElementById('head-item-4').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[3] = undefined;
		elevation[3] = undefined;

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		deleteBall(4);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(4,0,3);
});
document.getElementById('head-item-5').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[4] = undefined;
		elevation[4] = undefined;

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		deleteBall(5);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(5,0,4);
});
document.getElementById('head-item-6').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[5] = undefined;
		elevation[5] = undefined;

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		deleteBall(6);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(6,0,5);
});
document.getElementById('head-item-7').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[6] = undefined;
		elevation[6] = undefined;

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		deleteBall(7);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(7,0,6);
});
document.getElementById('head-item-8').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[7] = undefined;
		elevation[7] = undefined;

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		deleteBall(8);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(8,0,7);
});
document.getElementById('head-item-9').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[8] = undefined;
		elevation[8] = undefined;

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		deleteBall(9);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(9,0,8);
});
document.getElementById('head-item-10').addEventListener("mousedown",function(e){
	if (delete_head){
		azimuth[9] = undefined;
		elevation[9] = undefined;

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		deleteBall(10);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(10,0,9);
});

document.getElementById('front-item-1').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[0] = undefined;
		elevation[0] = undefined;

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		deleteBall(1);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(1,1,0);
});
document.getElementById('front-item-2').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[1] = undefined;
		elevation[1] = undefined;

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		deleteBall(2);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(2,1,1);
});
document.getElementById('front-item-3').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[2] = undefined;
		elevation[2] = undefined;

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		deleteBall(3);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(3,1,2);
});
document.getElementById('front-item-4').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[3] = undefined;
		elevation[3] = undefined;

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		deleteBall(4);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(4,1,3);
});
document.getElementById('front-item-5').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[4] = undefined;
		elevation[4] = undefined;

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		deleteBall(5);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(5,1,4);
});
document.getElementById('front-item-6').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[5] = undefined;
		elevation[5] = undefined;

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		deleteBall(6);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(6,1,5);
});
document.getElementById('front-item-7').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[6] = undefined;
		elevation[6] = undefined;

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		deleteBall(7);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(7,1,6);
});
document.getElementById('front-item-8').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[7] = undefined;
		elevation[7] = undefined;

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		deleteBall(8);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(8,1,7);
});
document.getElementById('front-item-9').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[8] = undefined;
		elevation[8] = undefined;

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		deleteBall(9);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(9,1,8);
});
document.getElementById('front-item-10').addEventListener("mousedown",function(e){
	if (delete_front){
		azimuth[9] = undefined;
		elevation[9] = undefined;

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		deleteBall(10);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(10,1,9);
});

document.getElementById('side-item-1').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[0] = undefined;
		elevation[0] = undefined;

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		deleteBall(1);
		
		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(1,2,0);
});
document.getElementById('side-item-2').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[1] = undefined;
		elevation[1] = undefined;

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		deleteBall(2);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(2,2,1);
});
document.getElementById('side-item-3').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[2] = undefined;
		elevation[2] = undefined;

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		deleteBall(3);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(3,2,2);
});
document.getElementById('side-item-4').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[3] = undefined;
		elevation[3] = undefined;

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		deleteBall(4);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(4,2,3);
});
document.getElementById('side-item-5').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[4] = undefined;
		elevation[4] = undefined;

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		deleteBall(5);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(5,2,4);
});
document.getElementById('side-item-6').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[5] = undefined;
		elevation[5] = undefined;

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		deleteBall(6);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(6,2,5);
});
document.getElementById('side-item-7').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[6] = undefined;
		elevation[6] = undefined;

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		deleteBall(7);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(7,2,6);
});
document.getElementById('side-item-8').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[7] = undefined;
		elevation[7] = undefined;

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		deleteBall(8);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(8,2,7);
});
document.getElementById('side-item-9').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[8] = undefined;
		elevation[8] = undefined;

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		deleteBall(9);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
		document.getElementById('body').style.cursor = 'default';
	}
	else dragElement(9,2,8);
});
document.getElementById('side-item-10').addEventListener("mousedown",function(e){
	if (delete_side){
		azimuth[9] = undefined;
		elevation[9] = undefined;

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		deleteBall(10);

		delete_head = false; delete_front = false; delete_side = false;
		e.metaKey = false;
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
	map: new THREE.TextureLoader().load('/templates/question/img/face.png'),
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

function displayBall(azimuth, elevation, number){
	var returnlist = polarToCartesian(azimuth, elevation, 15);
	ballGeometry = new THREE.SphereGeometry(0.8,60,30);
	ballMaterial = new THREE.MeshLambertMaterial({
		color: colors[number-1]
	});
	var ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.name = 'ball'+number;
	ball.position.set(returnlist['x'], returnlist['y'], returnlist['z']);
	scene.remove(scene.getObjectByName('ball'+number));
	scene.add(ball);
	return ball;
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