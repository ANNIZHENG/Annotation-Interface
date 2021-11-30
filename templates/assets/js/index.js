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

function addSourceCount(){
	document.getElementById('btn-button-next').style.display='none';
	document.getElementById('2d-question').innerHTML="Please identify the location of each source:";

	// this is for the first enter
	document.getElementById('head').setAttribute('style',"background-image: url('templates/img/head.png');");
	document.getElementById('front').setAttribute('style',"background-image: url('templates/img/front.png'); display: inline-block;");
	document.getElementById('side').setAttribute('style',"background-image: url('templates/img/side.png'); display: inline-block;");

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
	action_type = "set audio play";
	value = null;
	timestamp = Date.now();
	ajax_interaction();
}

function displaySelection(){
	// if user listened to audio; then show source count dropdown
	document.getElementById('count').setAttribute('style','');
}

function displayButton(){ // NEXT or SUBMIT
	var index = 0;
	while (index < source_count){
		if (azimuth[index] == undefined || elevation[index] == undefined){ // do not display btn if source count not completed
			document.getElementById('btn-button-next').style.display = 'none';
			document.getElementById('btn-button-submit').style.display = 'none';
			return;
		}
		index += 1;
	}
	if (!last_question) document.getElementById('btn-button-next').setAttribute('style','');
	else document.getElementById('btn-button-submit').setAttribute('style','');
}

function setNextQuestion(){
	if (document.getElementById('count').value == undefined){ // do not go to the next qst if source count not completed
		window.alert("You must select a response");
		return;
	}

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

	var audio = document.getElementById('audio');
	var source = document.getElementById('source');
	source.src = audio_source; // load new audio
	audio.load();
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

function dragElement(item,azimuth_present,add_index) {
	item.setAttribute('style',''); // present the item

	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
	item.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
  		pos4 = e.clientY;
		document.onmousemove = elementDrag;
		document.onmouseup = closeDragElement;
	}
  
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
  		pos2 = pos4 - e.clientY;
  		pos3 = e.clientX;
  		pos4 = e.clientY;
		var y = item.offsetTop - pos2;
		var x = item.offsetLeft - pos1;

		if ( Math.sqrt(Math.pow( 82.5 - x,2 ) + Math.pow( 82.5 - y,2 )) <= 82.5
		&& Math.sqrt(Math.pow( 82.5 - x,2 ) + Math.pow( 82.5 - y,2 )) > 80 )
		{
			item.style.top = y + "px";
			item.style.left = x + "px";
		}

		if (azimuth_present){
			action_type = "azimuth"; // for ajax
			timestamp = Date.now(); // for ajax
			calculateAzimuth(x,y);
			azimuth[add_index] = curr_azimuth;
			value = curr_azimuth; // for ajax
		}
		else{
			action_type = "elevation"; // for ajax
			timestamp = Date.now(); // for ajax
			curr_elevation = Math.abs(y - 165);
			elevation[add_index] = curr_elevation;
			value = curr_elevation; // for ajax
		}
		displayButton();
	}

	function closeDragElement(){
		ajax_interaction();
	  	document.onmouseup = null;
	  	document.onmousemove = null;
	}
}

// adding dots
document.addEventListener('keydown',keyboardEvent,true);
function keyboardEvent(e){
	if (e.ctrlKey && e.which == 72){ // Add Head
		if (azimuth_count == source_count){ // if already annotated all azimuth
			window.alert("You have already enter " + source_count + " azimuth elements")
			return;
		}

		var temp_azimuth_index = 0; // this is for retrieving HTML element
		var index = 0;
		while (index < source_count){
			if (azimuth[index] == undefined){
				temp_azimuth_index = index+1;
				break;
			}
			index += 1;
		}
		var dragInput = "head-item-"+temp_azimuth_index;
		var item = document.getElementById(dragInput);
		azimuth_count += 1;

		dragElement(item,true,temp_azimuth_index-1);
	}
	else if (e.ctrlKey && e.which == 70){ // Add Front
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
		var dragInput = "front-item-"+temp_elevation_index;
		var item = document.getElementById(dragInput);
		elevation_count += 1;
 		dragElement(item,false,temp_elevation_index-1);
	}
	else if (e.ctrlKey && e.which == 83){ // Add Side
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
		var dragInput = "side-item-"+temp_elevation_index;
		var item = document.getElementById(dragInput);
		elevation_count += 1;
		dragElement(item,false,temp_elevation_index-1);
	}
	else if (e.shiftKey && e.which == 72){ // Delete Head
		if (azimuth_count == 0){ // if there is no azimuth entered
			window.alert("There is no azimuth element");
		}
		else{
			azimuth_count -= 1; // deleting one azimuth element
			document.getElementById('head-item-1').addEventListener("click",function(){
				document.getElementById('head-item-1').style.display = 'none';
				azimuth[0] = undefined;
				displayButton();
			});
			document.getElementById('head-item-2').addEventListener("click",function(){
				document.getElementById('head-item-2').style.display = 'none';
				azimuth[1] = undefined;
				displayButton();
			});
			document.getElementById('head-item-3').addEventListener("click",function(){
				document.getElementById('head-item-3').style.display = 'none';
				azimuth[2] = undefined;
				displayButton();
			});
			document.getElementById('head-item-4').addEventListener("click",function(){
				document.getElementById('head-item-4').style.display = 'none';
				azimuth[3] = undefined;
				displayButton();
			});
			document.getElementById('head-item-5').addEventListener("click",function(){
				document.getElementById('head-item-5').style.display = 'none';
				azimuth[4] = undefined;
				displayButton();
			});
			document.getElementById('head-item-6').addEventListener("click",function(){
				document.getElementById('head-item-6').style.display = 'none';
				azimuth[5] = undefined;
				displayButton();
			});
			document.getElementById('head-item-7').addEventListener("click",function(){
				document.getElementById('head-item-7').style.display = 'none';
				azimuth[6] = undefined;
				displayButton();
			});
			document.getElementById('head-item-8').addEventListener("click",function(){
				document.getElementById('head-item-8').style.display = 'none';
				azimuth[7] = undefined;
				displayButton();
			});
			document.getElementById('head-item-9').addEventListener("click",function(){
				document.getElementById('head-item-9').style.display = 'none';
				azimuth[8] = undefined;
				displayButton();
			});
			document.getElementById('head-item-10').addEventListener("click",function(){
				document.getElementById('head-item-10').style.display = 'none';
				azimuth[9] = undefined;
				displayButton();
			});
		}
	}
	else if (e.shiftKey && e.which == 70){ // Delete Front
		if (elevation_count == 0){
			window.alert("There is no elevation element");
		}
		else{
			elevation_count -= 1;	
			document.getElementById('front-item-1').addEventListener("click",function(){
				document.getElementById('front-item-1').style.display = 'none';
				elevation[0] = undefined;
				displayButton();
			});
			document.getElementById('front-item-2').addEventListener("click",function(){
				document.getElementById('front-item-2').style.display = 'none';
				elevation[1] = undefined;
				displayButton();
			});
			document.getElementById('front-item-3').addEventListener("click",function(){
				document.getElementById('front-item-3').style.display = 'none';
				elevation[2] = undefined;
				displayButton();
			});
			document.getElementById('front-item-4').addEventListener("click",function(){
				document.getElementById('front-item-4').style.display = 'none';
				elevation[3] = undefined;
				displayButton();
			});
			document.getElementById('front-item-5').addEventListener("click",function(){
				document.getElementById('front-item-5').style.display = 'none';
				elevation[4] = undefined;
				displayButton();
			});
			document.getElementById('front-item-6').addEventListener("click",function(){
				document.getElementById('front-item-6').style.display = 'none';
				elevation[5] = undefined;
				displayButton();
			});
			document.getElementById('front-item-7').addEventListener("click",function(){
				document.getElementById('front-item-7').style.display = 'none';
				elevation[6] = undefined;
				displayButton();
			});
			document.getElementById('front-item-8').addEventListener("click",function(){
				document.getElementById('front-item-8').style.display = 'none';
				elevation[7] = undefined;
				displayButton();
			});
			document.getElementById('front-item-9').addEventListener("click",function(){
				document.getElementById('front-item-9').style.display = 'none';
				elevation[8] = undefined;
				displayButton();
			});
			document.getElementById('front-item-10').addEventListener("click",function(){
				document.getElementById('front-item-10').style.display = 'none';
				elevation[9] = undefined;
				displayButton();
			});
		}
	}
	else if (e.shiftKey && e.which == 83){ // Delete Side
		if (elevation_count == 0){
			window.alert("There is no elevation element");
		}
		else{
			elevation_count -= 1;	
			document.getElementById('side-item-1').addEventListener("click",function(){
				document.getElementById('side-item-1').style.display = 'none';
				elevation[0] = undefined;
				displayButton();
			});
			document.getElementById('side-item-2').addEventListener("click",function(){
				document.getElementById('side-item-2').style.display = 'none';
				elevation[1] = undefined;
				displayButton();
			});
			document.getElementById('side-item-3').addEventListener("click",function(){
				document.getElementById('side-item-3').style.display = 'none';
				elevation[2] = undefined;
				displayButton();
			});
			document.getElementById('side-item-4').addEventListener("click",function(){
				document.getElementById('side-item-4').style.display = 'none';
				elevation[3] = undefined;
				displayButton();
			});
			document.getElementById('side-item-5').addEventListener("click",function(){
				document.getElementById('side-item-5').style.display = 'none';
				elevation[4] = undefined;
				displayButton();
			});
			document.getElementById('side-item-6').addEventListener("click",function(){
				document.getElementById('side-item-6').style.display = 'none';
				elevation[5] = undefined;
			});
			document.getElementById('side-item-7').addEventListener("click",function(){
				document.getElementById('side-item-7').style.display = 'none';
				elevation[6] = undefined;
				displayButton();
			});
			document.getElementById('side-item-8').addEventListener("click",function(){
				document.getElementById('side-item-8').style.display = 'none';
				elevation[7] = undefined;
				displayButton();
			});
			document.getElementById('side-item-9').addEventListener("click",function(){
				document.getElementById('side-item-9').style.display = 'none';
				elevation[8] = undefined;
				displayButton();
			});
			document.getElementById('side-item-10').addEventListener("click",function(){
				document.getElementById('side-item-10').style.display = 'none';
				elevation[9] = undefined;
				displayButton();
			});
		}
	}
}

function calculateAzimuth(x,y){
	if ( x>82.5 && y<82.5 ){ // Quadrant 1 // TODO: adjust
		var newx = x - 82.5;
		var newy = 82.5 - y;
		arccosine = Math.acos(newy / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI));
	}
	else if ( x>82.5 && y>82.5 ){ // Quadrant 2
		var newx = x - 82.5;
		var newy = y - 82.5;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+90;
	}
	else if ( x < 82.5 && y > 82.5 ){ // Quadrant 3
		var newx = 82.5 - x;
		var newy = 82.5 - y;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = 270 - Math.round(arccosine * (180/Math.PI));
	}
	else{ // Quadrant 4
		var newx = 82.5 - x;
		var newy = y - 82.5;
		arccosine = Math.acos(newx / (Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2))));
		curr_azimuth = Math.round(arccosine * (180/Math.PI))+270;
	}
}

function checkRepeatLocation(){ // THIS WILL BE AMELIORATED LATER
	var index = 0;
	while (index < source_count){
		if (azimuth[index] == undefined || elevation[index] == undefined){
			return true; // cannot be determined yet
		}
		else if (azimuth[index] == curr_azimuth && elevation[index] == curr_elevation){
			window.alert("You have entered the same azimuth and elevation");
			return false; // if false then repeats
		}
		index += 1;
	}
	return true;
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