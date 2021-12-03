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
	while (index < source_count){
		if (azimuth[index] == undefined || elevation[index] == undefined){
			if (confirm("You haven't annotated all sources. Do you still want to proceed?")) return true;
			else return false;
		}
		index += 1;
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

function dragElement(index,indicator,add_index) {
	var item, inner_item, frame;

	if (indicator == 0){
		item = document.getElementById('circular'+index);
		inner_item = document.getElementById('head-item-'+index);
		frame = document.getElementById('head');
		action_type = "azimuth";
		azimuth[add_index] = curr_azimuth; // not formal
	}
	else if (indicator == 1){
		item = document.getElementById('circularF'+index);
		inner_item = document.getElementById('front-item-'+index);
		frame = document.getElementById('front');
		action_type = "elevation";
		elevation[add_index] = curr_elevation; // not formal
	}
	else{
		item = document.getElementById('circularS'+index);
		inner_item = document.getElementById('side-item-'+index);
		frame = document.getElementById('side');
		action_type = "elevation";
		elevation[add_index] = curr_elevation; // not formal
	}

	item.setAttribute('style',''); // display item
	inner_item.setAttribute('style',''); // display inner item

	item.onmousedown = function (e) {
   		document.onmousemove = mouse;
		document.onmouseup = function (e) {
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
			let determine = checkRepeatLocation();
			if (determine){
				ajax_interaction();
			}
			document.onmouseup = null;
			document.onmousemove = null;
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
	if ( x>cx && y<cy ){
		var newx = x - cx;
		var newy = cy - y;
		arccosine = Math.acos(newy / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI));
	}
	else if ( x>cx && y>cy ){
		var newx = x - cx;
		var newy = y - cy;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+90;
	}
	else if ( x < cx && y > cy ){
		var newx = cx - x;
		var newy = cy - y;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = 270 - Math.round(arccosine * (180/Math.PI));
	}
	else{
		var newx = cx - x;
		var newy = y - cy;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+270;
	}
}

// adding dots
document.addEventListener("keydown", keyboardEvent, false);

let delete_head = false;
let delete_front = false;
let delete_side = false;

function keyboardEvent(e){
	if (e.ctrlKey && e.which == 72){ // Add Head
		delete_head,delete_front,delete_side = false;

		if (azimuth_count == source_count){
			window.alert("You have already enter " + source_count + " azimuth elements")
			return;
		}
		var temp_azimuth_index = 0;
		var index = 0;
		while (index < source_count){
			if (azimuth[index] == undefined){
				temp_azimuth_index = index+1;
				break;
			}
			index += 1;
		}
		curr_azimuth = 0;
		azimuth_count += 1;
		dragElement(temp_azimuth_index,0,temp_azimuth_index-1);
	}
	else if (e.ctrlKey && e.which == 70){ // Add Front
		delete_head,delete_front,delete_side = false;

		if (elevation_count == source_count){
			window.alert("You have already enter " + source_count + " elevation elements")
			return;
		}
		var temp_elevation_index = 0;
		var index = 0;
		while (index < source_count){
			if (elevation[index] == undefined){
				temp_elevation_index = index+1;
				break;
			}
			index += 1;
		}
		curr_elevation = 180;
		elevation_count += 1;
		dragElement(temp_elevation_index,1,temp_elevation_index-1);
	}
	else if (e.ctrlKey && e.which == 83){ // Add Side
		delete_head,delete_front,delete_side = false;

		if (elevation_count == source_count){
			window.alert("You have already enter " + source_count + " elevation elements")
			return;
		}
		var temp_elevation_index = 0;
		var index = 0;
		while (index < source_count){
			if (elevation[index] == undefined){
				temp_elevation_index = index+1;
				break;
			}
			index += 1;
		}
		curr_elevation = 180;
		elevation_count += 1;
		dragElement(temp_elevation_index,2,temp_elevation_index-1);
	}
	else if (e.shiftKey && e.which == 72){ // Delete Head
		if (azimuth_count == 0){ // if there is no azimuth entered
			window.alert("There is no azimuth element");
		}
		else{
			delete_head = true;
		}
	}
	else if (e.shiftKey && e.which == 70){ // Delete Front
		if (elevation_count == 0){
			window.alert("There is no elevation element");
		}
		else{
			delete_front = true;
		}
	}
	else if (e.shiftKey && e.which == 83){ // Delete Side
		if (elevation_count == 0){
			window.alert("There is no elevation element");
		}
		else{
			delete_side = true;
		}
	}
}

function reloadAll(){
	var index = 0;
	while (index < 10){
		document.getElementById('circular'+(index+1)).style.display = 'none';
		document.getElementById('circularF'+(index+1)).style.display = 'none';
		document.getElementById('circularS'+(index+1)).style.display = 'none';
		document.getElementById('head-item-'+(index+1)).style.display = 'none';
		document.getElementById('front-item-'+(index+1)).style.display = 'none';
		document.getElementById('side-item-'+(index+1)).style.display = 'none';
		index += 1;
	}
}

function checkRepeatLocation(){
	var index = 0;
	while (index < source_count){
		if (azimuth[index] == curr_azimuth && elevation[index] == curr_elevation){
			window.alert("You have entered the same azimuth and elevation");
			return false;
		}
		index += 1;
	}
	return true;
}

document.getElementById('head-item-1').addEventListener("click",function(){
	if (delete_head){
		// do not display dots
		document.getElementById('circular1').style.display = 'none';
		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('circularF1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('circularS1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';

		// -1 elevation and azimuth count
		azimuth[0] = undefined;
		azimuth_count -= 1;
		elevation[0] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-2').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular2').style.display = 'none';
		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('circularF2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('circularS2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';

		azimuth[1] = undefined;
		azimuth_count -= 1;
		elevation[1] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-3').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular3').style.display = 'none';
		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('circularF3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('circularS3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';

		azimuth[2] = undefined;
		azimuth_count -= 1;
		elevation[2] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-4').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular4').style.display = 'none';
		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('circularF4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('circularS4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';

		azimuth[3] = undefined;
		azimuth_count -= 1;
		elevation[3] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-5').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular5').style.display = 'none';
		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('circularF5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('circularS5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';

		azimuth[4] = undefined;
		azimuth_count -= 1;
		elevation[4] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-6').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular6').style.display = 'none';
		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('circularF6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('circularS6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';

		azimuth[5] = undefined;
		azimuth_count -= 1;
		elevation[5] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-7').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular7').style.display = 'none';
		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('circularF7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('circularS7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';

		azimuth[6] = undefined;
		azimuth_count -= 1;
		elevation[6] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-8').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular8').style.display = 'none';
		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('circularF8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('circularS8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';

		azimuth[7] = undefined;
		azimuth_count -= 1;
		elevation[7] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-9').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular9').style.display = 'none';
		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('circularF9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('circularS9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';

		azimuth[8] = undefined;
		azimuth_count -= 1;
		elevation[8] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});
document.getElementById('head-item-10').addEventListener("click",function(){
	if (delete_head){
		document.getElementById('circular10').style.display = 'none';
		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('circularF10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('circularS10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';

		azimuth[9] = undefined;
		azimuth_count -= 1;
		elevation[9] = undefined;
		elevation_count -= 1;

		delete_head = false;
	}
});

document.getElementById('front-item-1').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular1').style.display = 'none';
		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('circularF1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('circularS1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';

		azimuth[0] = undefined;
		azimuth_count -= 1;
		elevation[0] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-2').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular2').style.display = 'none';
		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('circularF2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('circularS2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';

		azimuth[1] = undefined;
		azimuth_count -= 1;
		elevation[1] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-3').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular3').style.display = 'none';
		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('circularF3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('circularS3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';

		azimuth[2] = undefined;
		azimuth_count -= 1;
		elevation[2] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-4').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular4').style.display = 'none';
		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('circularF4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('circularS4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';

		azimuth[3] = undefined;
		azimuth_count -= 1;
		elevation[3] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-5').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular5').style.display = 'none';
		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('circularF5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('circularS5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';

		azimuth[4] = undefined;
		azimuth_count -= 1;
		elevation[4] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-6').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular6').style.display = 'none';
		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('circularF6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('circularS6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';

		azimuth[5] = undefined;
		azimuth_count -= 1;
		elevation[5] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-7').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular7').style.display = 'none';
		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('circularF7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('circularS7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';

		azimuth[6] = undefined;
		azimuth_count -= 1;
		elevation[6] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-8').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular8').style.display = 'none';
		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('circularF8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('circularS8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';

		azimuth[7] = undefined;
		azimuth_count -= 1;
		elevation[7] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-9').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular9').style.display = 'none';
		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('circularF9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('circularS9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';

		azimuth[8] = undefined;
		azimuth_count -= 1;
		elevation[8] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});
document.getElementById('front-item-10').addEventListener("click",function(){
	if (delete_front){
		document.getElementById('circular10').style.display = 'none';
		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('circularF10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('circularS10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';

		azimuth[9] = undefined;
		azimuth_count -= 1;
		elevation[9] = undefined;
		elevation_count -= 1;

		delete_front = false;
	}
});

document.getElementById('side-item-1').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular1').style.display = 'none';
		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('circularF1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('circularS1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';

		azimuth[0] = undefined;
		azimuth_count -= 1;
		elevation[0] = undefined;
		elevation_count -= 1;
		
		delete_front = false;
	}
});
document.getElementById('side-item-2').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular2').style.display = 'none';
		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('circularF2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('circularS2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';

		azimuth[1] = undefined;
		azimuth_count -= 1;
		elevation[1] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-3').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular3').style.display = 'none';
		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('circularF3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('circularS3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';

		azimuth[2] = undefined;
		azimuth_count -= 1;
		elevation[2] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-4').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular4').style.display = 'none';
		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('circularF4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('circularS4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';

		azimuth[3] = undefined;
		azimuth_count -= 1;
		elevation[3] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-5').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular5').style.display = 'none';
		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('circularF5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('circularS5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';

		azimuth[4] = undefined;
		azimuth_count -= 1;
		elevation[4] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-6').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular6').style.display = 'none';
		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('circularF6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('circularS6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';

		azimuth[5] = undefined;
		azimuth_count -= 1;
		elevation[5] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-7').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular7').style.display = 'none';
		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('circularF7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('circularS7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';

		azimuth[6] = undefined;
		azimuth_count -= 1;
		elevation[6] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-8').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular8').style.display = 'none';
		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('circularF8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('circularS8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';

		azimuth[7] = undefined;
		azimuth_count -= 1;
		elevation[7] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-9').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular9').style.display = 'none';
		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('circularF9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('circularS9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';

		azimuth[8] = undefined;
		azimuth_count -= 1;
		elevation[8] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});
document.getElementById('side-item-10').addEventListener("click",function(){
	if (delete_side){
		document.getElementById('circular10').style.display = 'none';
		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('circularF10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('circularS10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';

		azimuth[9] = undefined;
		azimuth_count -= 1;
		elevation[9] = undefined;
		elevation_count -= 1;

		delete_side = false;
	}
});