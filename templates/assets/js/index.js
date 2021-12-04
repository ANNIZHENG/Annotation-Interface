let annotation_id = 1;
const totalAnnotation = 3;

// used to retrieve item elements
let azimuth_count = 0;
let elevation_count = 0;

// Location
let curr_azimuth = 0;
let curr_elevation = 0;
let azimuth = new Array();
let elevation = new Array();

// Reach to the last question?
let last_question = false;

// Annotation
let source_count = 0;

// Interaction
let action_type = undefined;
let value = undefined;
let timestamp = undefined;

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
	document.getElementById('head').setAttribute('style',"background-image: url('templates/img/head.png');");
	document.getElementById('front').setAttribute('style',"background-image: url('templates/img/front.png'); display: inline-block;");
	document.getElementById('side').setAttribute('style',"background-image: url('templates/img/side.png'); display: inline-block;");

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
	azimuth_count = 0;
	elevation_count = 0;
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
	// do not go to the next qst if source count not completed
	if (document.getElementById('count').value == undefined){
		window.alert("You must select a response");
		return;
	}

	// if user not enter enough annotation -> ask whether or not to proceed
	var proceed = askProceed();
	if (!proceed) {return;}

	ajax_next(); // update locations and source count to database

	annotation_id += 1; // increment current question number

	azimuth_count = 0; // clear azimuth count
	elevation_count = 0; // clear elevation count

	// when reaching to the last question
	if (annotation_id == totalAnnotation) last_question = true;

	let listen = 'Listen to the audio ['+ annotation_id +' / 3]';
	let audio_source = 'templates/assets/audio/test'+annotation_id+'.wav';
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
}

function askProceed(){
	var index = 0;
	var count_enter = 0;
	while (index < source_count){
		if (azimuth[index] != undefined && elevation[index] != undefined) count_enter += 1;
		index += 1;
	}
	if (count_enter == 0){
		window.alert("You have to annotate at least one location");
		return false;
	}
	if (azimuth_count != elevation_count){
		window.alert("You must annotate equal number of azimuth and elevation");
		return false;
	}
	if (count_enter < source_count){
		if (confirm("You haven't annotated all sources. Do you still want to proceed?")){return true;}
		else {return false;}
	}
	else return true;
}

function ajax_interaction(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/interaction', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({annotation_id,action_type,value,timestamp});
	req.send(data);
}

function ajax_next(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/next', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({annotation_id,azimuth,elevation,source_count});
	req.send(data);
	azimuth = new Array();
	elevation = new Array();
}

/* container.3d */

container = document.getElementById('3d-head');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
var light = new THREE.HemisphereLight(0xffffff, 1);
scene.add(light);

var pointLight = new THREE.PointLight(0xffffff, 0.7);
pointLight.position.set(60, 10, 150);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 25;

const ringGeometry1 = new THREE.RingGeometry(18.5,19,100);
const ringMaterial1 = new THREE.MeshLambertMaterial({color: 0x0000ff,side: THREE.DoubleSide});

const ringGeometry2 = new THREE.RingGeometry(15,15.3,100);
const ringMaterial2 = new THREE.MeshLambertMaterial({color: 0x0000ff,side: THREE.DoubleSide});

var sphereGeometry = new THREE.SphereGeometry(8,30,30);
var sphereMaterial = new THREE.MeshLambertMaterial({
	map: new THREE.TextureLoader().load('/templates/img/face.png')
});

var ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
var ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
ring2.rotation.x = 30;

var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
scene.add(ring1);
scene.add(ring2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(400,400);
container.appendChild(renderer.domElement);

function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene,camera); 
}
animate();


/* container.2d.location */
let del = false; // used to suppress item.onmousedown event listener while deleting

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
					ajax_interaction();
				}
				else{
					elevation[add_index] = curr_elevation;
					value = curr_elevation;
					timestamp = Date.now(); // TODO checkRepeat
					ajax_interaction();
				}
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

// adding dots
document.addEventListener("keydown", keyboardEvent, false);

let delete_head,delete_front,delete_side = false;

function keyboardEvent(e){
	if (e.ctrlKey && e.which == 72){ // Add Head
		delete_head,delete_front,delete_side = false;

		if (azimuth_count == source_count){
			window.alert("You have already enter " + source_count + " azimuth elements")
			return;
		}

		document.getElementById('body').style.cursor = 'cell'; // change cursor shape

		var temp_azimuth_index = 0;
		var index = 0;
		while (index < source_count){
			if (azimuth[index] == undefined){
				temp_azimuth_index = index+1;
				break;
			}
			index += 1;
		}

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

			if (xdistance < 83 && ydistance < 83){
				calculateAzimuth(e.pageX,e.pageY,cx,cy);
				azimuth[temp_azimuth_index-1] = curr_azimuth;
				inner_item.setAttribute('style','');
				item.style.transform = 'rotate('+curr_azimuth+'deg)';

				// ajax_interaction()
				action_type = "azimuth";
				value = curr_azimuth;
				timestamp = Date.now();
				ajax_interaction();
				azimuth_count += 1;
			}
			document.getElementById('body').style.cursor = 'default';
		}, {once: true});
	}
	else if (e.ctrlKey && e.which == 70){ // Add Front
		delete_head,delete_front,delete_side = false;

		if (elevation_count == source_count){
			window.alert("You have already enter " + source_count + " elevation elements")
			return;
		}

		document.getElementById('body').style.cursor = 'cell'; // change cursor shape

		var temp_elevation_index = 0;
		var index = 0;
		while (index < source_count){
			if (elevation[index] == undefined){
				temp_elevation_index = index+1;
				break;
			}
			index += 1;
		}

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

			if (xdistance < 83 && ydistance < 83){
				// locate the element first
				calculateAzimuth(e.pageX,e.pageY,cx,cy);
				inner_item.setAttribute('style','');
				item.style.transform = 'rotate('+curr_azimuth+'deg)';

				// calculate current elevation
				flocation = frame.getBoundingClientRect();
				innerlocation = inner_item.getBoundingClientRect();
				curr_elevation = parseInt(flocation.bottom - innerlocation.top);
				elevation[temp_elevation_index-1] = curr_elevation;

				// ajax_interaction()
				action_type = "elevation";
				value = curr_elevation;
				timestamp = Date.now();
				ajax_interaction();
				elevation_count += 1;
			}
			document.getElementById('body').style.cursor = 'default';
		},  {once: true});
	}
	else if (e.ctrlKey && e.which == 83){ // Add Side
		delete_head,delete_front,delete_side = false;

		if (elevation_count == source_count){
			window.alert("You have already enter " + source_count + " elevation elements")
			return;
		}

		// change cursor shape
		document.getElementById('body').style.cursor = 'cell';

		var temp_elevation_index = 0;
		var index = 0;
		while (index < source_count){
			if (elevation[index] == undefined){
				temp_elevation_index = index+1;
				break;
			}
			index += 1;
		}

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

			if (xdistance < 83 && ydistance < 83){
				// locate the element first
				calculateAzimuth(e.pageX,e.pageY,cx,cy);
				inner_item.setAttribute('style','');
				item.style.transform = 'rotate('+curr_azimuth+'deg)';

				// calculate current elevation
				flocation = frame.getBoundingClientRect();
				innerlocation = inner_item.getBoundingClientRect();
				curr_elevation = parseInt(flocation.bottom - innerlocation.top);
				elevation[temp_elevation_index-1] = curr_elevation;

				// ajax_interaction()
				action_type = "elevation";
				value = curr_elevation;
				timestamp = Date.now();
				ajax_interaction();
				elevation_count += 1;
			}
			document.getElementById('body').style.cursor = 'default';
		},  {once: true});
	}
	else if (e.shiftKey && e.which == 72){ // Delete Head
		if (azimuth_count == 0){
			window.alert("There is no azimuth element");
		}
		else{
			document.getElementById('body').style.cursor = "url('templates/img/minus.svg'),auto";
			delete_head = true;
			del = true;
		}
	}
	else if (e.shiftKey && e.which == 70){ // Delete Front
		if (elevation_count == 0){
			window.alert("There is no elevation element");
		}
		else{
			document.getElementById('body').style.cursor = "url('templates/img/minus.svg'),auto";
			delete_front = true;
			del = true;
		}
	}
	else if (e.shiftKey && e.which == 83){ // Delete Side
		if (elevation_count == 0){
			window.alert("There is no elevation element");
		}
		else{
			document.getElementById('body').style.cursor = "url('templates/img/minus.svg'),auto";
			delete_side = true;
			del = true;
		}
	}
	console.log("azimuth: "+azimuth.toString()+"\nsazimuth_count: "+azimuth_count);
	console.log("elevation: "+elevation.toString()+"\nelevation_count: "+elevation_count);
}

function reloadAll(){
	var index = 0;
	while (index < 10){
		document.getElementById('head-item-'+(index+1)).style.display = 'none';
		document.getElementById('front-item-'+(index+1)).style.display = 'none';
		document.getElementById('side-item-'+(index+1)).style.display = 'none';
		index += 1;
	}
}

document.getElementById('head-item-1').addEventListener("mousedown",function(){
	if (delete_head){
		// do not display dots
		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';

		// -1 elevation and azimuth count
		azimuth[0] = undefined;
		elevation[0] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(1,0,0);
});
document.getElementById('head-item-2').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';

		azimuth[1] = undefined;
		elevation[1] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(2,0,1);
});
document.getElementById('head-item-3').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';

		azimuth[2] = undefined;
		elevation[2] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(3,0,2);
});
document.getElementById('head-item-4').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';

		azimuth[3] = undefined;
		elevation[3] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(4,0,3);
});
document.getElementById('head-item-5').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';

		azimuth[4] = undefined;
		elevation[4] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(5,0,4);
});
document.getElementById('head-item-6').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';

		azimuth[5] = undefined;
		elevation[5] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(6,0,5);
});
document.getElementById('head-item-7').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';

		azimuth[6] = undefined;
		elevation[6] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(7,0,6);
});
document.getElementById('head-item-8').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';

		azimuth[7] = undefined;
		elevation[7] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(8,0,7);
});
document.getElementById('head-item-9').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';

		azimuth[8] = undefined;
		elevation[8] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(9,0,8);
});
document.getElementById('head-item-10').addEventListener("mousedown",function(){
	if (delete_head){
		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';

		azimuth[9] = undefined;
		elevation[9] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_head = false;
	}
	else dragElement(10,0,9);
});

document.getElementById('front-item-1').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';

		azimuth[0] = undefined;
		elevation[0] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(1,1,0);
});
document.getElementById('front-item-2').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';

		azimuth[1] = undefined;
		elevation[1] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(2,1,1);
});
document.getElementById('front-item-3').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';

		azimuth[2] = undefined;
		elevation[2] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(3,1,2);
});
document.getElementById('front-item-4').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';

		azimuth[3] = undefined;
		elevation[3] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(4,1,3);
});
document.getElementById('front-item-5').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';

		azimuth[4] = undefined;
		elevation[4] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(5,1,4);
});
document.getElementById('front-item-6').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';

		azimuth[5] = undefined;
		elevation[5] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(6,1,5);
});
document.getElementById('front-item-7').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';

		azimuth[6] = undefined;
		elevation[6] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(7,1,6);
});
document.getElementById('front-item-8').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';

		azimuth[7] = undefined;
		elevation[7] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(8,1,7);
});
document.getElementById('front-item-9').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';

		azimuth[8] = undefined;
		elevation[8] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(9,1,8);
});
document.getElementById('front-item-10').addEventListener("mousedown",function(){
	if (delete_front){
		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';

		azimuth[9] = undefined;
		elevation[9] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_front = false;
	}
	else dragElement(10,1,9);
});

document.getElementById('side-item-1').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';

		azimuth[0] = undefined;
		elevation[0] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;
		
		delete_front = false;
	}
	else dragElement(1,2,0);
});
document.getElementById('side-item-2').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';

		azimuth[1] = undefined;
		elevation[1] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(2,2,1);
});
document.getElementById('side-item-3').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';

		azimuth[2] = undefined;
		elevation[2] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(3,2,2);
});
document.getElementById('side-item-4').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';

		azimuth[3] = undefined;
		elevation[3] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(4,2,3);
});
document.getElementById('side-item-5').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';

		azimuth[4] = undefined;
		elevation[4] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(5,2,4);
});
document.getElementById('side-item-6').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';

		azimuth[5] = undefined;
		elevation[5] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(6,2,5);
});
document.getElementById('side-item-7').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';

		azimuth[6] = undefined;
		elevation[6] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(7,2,6);
});
document.getElementById('side-item-8').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';

		azimuth[7] = undefined;
		elevation[7] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(8,2,7);
});
document.getElementById('side-item-9').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';

		azimuth[8] = undefined;
		elevation[8] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(9,2,8);
});
document.getElementById('side-item-10').addEventListener("mousedown",function(){
	if (delete_side){
		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';

		azimuth[9] = undefined;
		elevation[9] = undefined;
		if (azimuth_count > 0) azimuth_count -= 1;
		if (elevation_count > 0) elevation_count -= 1;

		delete_side = false;
	}
	else dragElement(10,2,9);
});