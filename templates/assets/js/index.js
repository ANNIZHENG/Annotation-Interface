let currentAnnotation = 1;
const totalAnnotation = 3;

const colors = ["#ff0000","#ffff00","#00ff00","#00bfff",
"#8000ff","#ff00ff","#ff8000","#000000","#00ffff","#ffc0cb"];
let elevation_index = 0;
let azimuth_index = 0;

// Location
let azimuth = new Array();
let elevation = new Array();
// this is used to determine if a certain position of the height is clicked
let elevation_posX = new Array(); 


let last_question = false;

// Annotation
let source_count = 0;

// Interaction
let action_type = undefined;
let value = undefined;
let timestamp = undefined;

document.getElementById('audio').addEventListener("ended",displaySelection);
document.getElementById('audio').addEventListener("playing",addPlaying);
document.getElementById('count').addEventListener("change",addSourceCount);

function addSourceCount(){
	loadHeadImg();
	loadFrontImg();
	loadSideImg();

	document.getElementById('2d-question').innerHTML="Please identify the location of each source:";
	document.getElementById('2d').setAttribute('style','');
	document.getElementById("head").setAttribute("style","cursor: crosshair;");
	document.getElementById("front").setAttribute("style","cursor: crosshair;");
	document.getElementById("side").setAttribute("style","cursor: crosshair;");
	
	// Annotation
	source_count= document.getElementById('count').value;

	// Interaction
	action_type = "source count";
	value = document.getElementById('count').value;
	timestamp = Date.now();
	ajax_interaction();

	// Reset location values
	azimuth = new Array();
	elevation = new Array();
	azimuth_index = 0;
	elevation_index = 0;
}

function addPlaying(){
	action_type = "set audio";
	value = null;
	timestamp = Date.now();
	ajax_interaction();
}

function displaySelection(){
	document.getElementById('count').setAttribute('style','');
}

function setNextQuestion(){
	if (document.getElementById('count').value == undefined){
		window.alert("You must select a response");
		return;
	}

	ajax_next();

	// increment current question number
	currentAnnotation += 1;

	// reset locatoin values
	elevation_index = 0;
	azimuth_index = 0;

	// when reaching to the last question
	if (currentAnnotation == totalAnnotation) last_question = true;

	let listen = 'Listen to the audio ['+ currentAnnotation +' / 3]';
	let audio_source = 'templates/assets/audio/test'+currentAnnotation+'.wav';
	document.getElementsByTagName('h2')[0].innerHTML=listen;
	document.getElementById('default-option').selected=true;

	// do not display questions & images yet
	document.getElementById('2d-question').innerHTML=""; // no asking for selection
	document.getElementById('count').style.display='none'; // no dropdown 
	document.getElementById('btn-button-next').style.display='none'; // no next button
	document.getElementById("head").style.display='none';
	document.getElementById("front").style.display='none';
	document.getElementById("side").style.display='none';

	var audio = document.getElementById('audio');
	var source = document.getElementById('source');
	source.src = audio_source; // load new audio
	audio.load();
}

function loadFrontImg(){
	var image = document.getElementById("front-img");
	var frontCanvas = document.getElementById('front');
	var ctx = frontCanvas.getContext('2d');
	ctx.drawImage(image,0,0,180,180);
}

function loadSideImg(){
	var image = document.getElementById("side-img");
	var sideCanvas = document.getElementById('side');
	var ctx = sideCanvas.getContext('2d');
	ctx.drawImage(image,0,0,180,180);
}

function loadHeadImg(){
	var image = document.getElementById("head-img");
	var headCanvas = document.getElementById('head');
	var ctx = headCanvas.getContext('2d');
	ctx.drawImage(image,0,0,180,180);
}

var side = document.getElementById("side").onmousedown = getCoordinatesSide;
function getCoordinatesSide(e){
	if (!e) var e = window.event;

	var curr_elevation = 180 - e.offsetY;
	var posX = e.offsetX;
	var result = addElevation(curr_elevation,posX);
	if (result){
		var ctx = document.getElementById("side").getContext("2d");
		drawCoordinates(elevation_index, ctx, e.offsetX, e.offsetY);
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
		drawCoordinates(elevation_index, ctx, e.offsetX, e.offsetY);
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
		drawCoordinates(azimuth_index, ctx, e.offsetX,e.offsetY);
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

function drawCoordinates(index,ctx,x,y){
	ctx.fillStyle = colors[index];
	ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
}

function ajax_interaction(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/interaction', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({currentAnnotation,action_type,value,timestamp});
	req.send(data);
}

function ajax_next(){
	var req = new XMLHttpRequest(); 
	req.open('POST', '/next', true);
	req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({currentAnnotation,azimuth,elevation,source_count});
	req.send(data);
	azimuth = new Array();
	elevation = new Array();
}

container = document.getElementById('3d-head');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
var light = new THREE.HemisphereLight(0xffffff, 1);
scene.add(light);

var pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(55, 60, 150);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 25;

const ringGeometry1 = new THREE.RingGeometry(18.5,19,100);
const ringMaterial1 = new THREE.MeshLambertMaterial({color: 0x0000ff,side: THREE.DoubleSide});

const ringGeometry2 = new THREE.RingGeometry(15,15.3,100);
const ringMaterial2 = new THREE.MeshLambertMaterial({color: 0xff0000,side: THREE.DoubleSide});

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
	sphere.rotation.y += 0.02;
	renderer.render(scene,camera);
}

animate();