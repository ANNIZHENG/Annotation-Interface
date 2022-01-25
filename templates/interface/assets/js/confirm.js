var recording;
var recording_dict = {};
var location_dict = {};
var matching = {};
var totalAnnotation;

var confirm_location = 0;
var confirm_recording = 0;
var confirm_recording_inner = 0;

function confirm_annotation(){
	var request = new XMLHttpRequest(); 
	request.open('POST', '/confirm_annotation');
	request.onreadystatechange = function() {
		if (request.readyState == 4){

			let dictionary = JSON.parse(request.response);

			// construct location_dict
			let index = 0;
			for (const [key,value] of Object.entries(dictionary["location_dict"])) {
				let inner_list = value.split(";");
				for (const loc of inner_list) {
					location_dict[index] = loc.split(",");
					index += 1;
				}
			}

			totalAnnotation = index;
			if(totalAnnotation == 0) window.location.assign('/templates/interface/submit.html');

			recording = dictionary["recording"]["0"];
			document.getElementById('original-audio-source').src = '/templates/interface/assets/audio/recording/'+recording+'.wav';
			document.getElementById('audiooriginal').load();

			addLocation(location_dict[0]);

			// construct recording_dict
			for (const [key,value] of Object.entries(dictionary["recording_dict"])) recording_dict[parseInt(key)] = value.split(',');
			for (const [key,value] of Object.entries(recording_dict[0])) addAudio(value);

			addButton();
		}
	}
	request.send();
}

// Click Events
document.addEventListener('click', function(e){
	if (e.target.className == 'audio-frame-confirm'){ // Change between 'Pause Audio' and 'Play Audio'
		var audios = document.getElementsByClassName('audio-frame-confirm');
		for (let i = 0; i < audios.length; i++) {
			if ( audios[i].id != e.target.id && document.getElementById(audios[i].id).innerHTML == 'Pause Audio'  ){
				window.alert('Please finish listening to the current audio');
				e.preventDefault();
				return;
			}
		}
		audio_id = 'audio' + e.target.id.replace('audio-frame-confirm-','');
		if (document.getElementById(e.target.id).innerHTML == 'Play Audio'){
			document.getElementById(audio_id).play();
			document.getElementById(e.target.id).innerHTML = 'Pause Audio';
		}
		else{
			document.getElementById(audio_id).pause();
			document.getElementById(e.target.id).innerHTML = 'Play Audio';
		}
		document.getElementById(audio_id).addEventListener("ended",function(){
			document.getElementById(e.target.id).innerHTML = 'Play Audio';
		});
		document.getElementById(audio_id).addEventListener("timeupdate",function(){
			let track = document.getElementById(audio_id).currentTime / document.getElementById(audio_id).duration * 100;
			document.getElementById(e.target.id).style.background = 'linear-gradient(to right, #efefef '+track+'%, #ffffff 0%)';
		});
	}
	if (e.target.className == 'btn-confirm'){ // When 'Next' or 'Submit' is clicked
		/*
		if (e.target.value == 'LAST'){
			e.preventDefault();
			setLastQuestion();
		} 
		
		else setNextQuestion();
		*/
		setNextQuestion();
	}
	if (e.target.className == 'btn-radio-confirm'){ // When input-radios are clicked
		let radios = document.getElementsByClassName('btn-radio-confirm');
		document.getElementById(e.target.id).checked = true;
		for (let i = 0; i < radios.length; i++) {
			if ( radios[i].id != e.target.id && document.getElementById(radios[i].id).checked ){
				document.getElementById(radios[i].id).checked = false;
			}
		}
	}
});

function setLastQuestion() {
	removeAllBalls();
	removeAllElements();

	// clear the last 2d annotation display
	let current_item_index = location_dict[confirm_location][2];
	document.getElementById('circular'+current_item_index).style.display = 'none';
	document.getElementById('circularF'+current_item_index).style.display = 'none';
	document.getElementById('circularS'+current_item_index).style.display = 'none';
	document.getElementById('head-item-'+current_item_index).style.display = 'none';
	document.getElementById('front-item-'+current_item_index).style.display = 'none';
	document.getElementById('side-item-'+current_item_index).style.display = 'none';

	confirm_location -= 1;
	if (confirm_recording_inner == 0) {
		confirm_recording_inner == recording_dict[confirm_recording-1].length;
		confirm_recording -= 1;
	}
	confirm_recording_inner -= 1;

	matching[confirm_location] = undefined;

	addLocation(location_dict[confirm_location]);
	for (const [key,value] of Object.entries(recording_dict[confirm_recording])) addAudio(value);

	addButton();
}

function setNextQuestion() {
	let radios = document.getElementsByClassName('btn-radio-confirm');
	let count = 0;

	for (let i = 0; i < radios.length; i++) {
		if (document.getElementById(radios[i].id).checked) {
			matching[confirm_location] = radios[i].id.replace('radio','');

			count += 1;
			confirm_location += 1;
			confirm_recording_inner += 1;
		}
	}
	if (count == 0){
		event.preventDefault();
		window.alert('Please select one corresponding audio');
		return false;
	}

	if (confirm_location == totalAnnotation) window.location.assign('/templates/interface/submit.html');
	else{
		removeAllBalls();
		removeAllElements();

		// clear current displayed 2d annotation
		let current_item_index = location_dict[confirm_location-1][2];
		document.getElementById('circular'+current_item_index).style.display = 'none';
		document.getElementById('circularF'+current_item_index).style.display = 'none';
		document.getElementById('circularS'+current_item_index).style.display = 'none';
		document.getElementById('head-item-'+current_item_index).style.display = 'none';
		document.getElementById('front-item-'+current_item_index).style.display = 'none';
		document.getElementById('side-item-'+current_item_index).style.display = 'none';

		// set up to display annotation
		addLocation(location_dict[confirm_location]);

		// set up to display audio choices
		if (confirm_recording_inner == recording_dict[confirm_recording].length){
			confirm_recording_inner = 0;
			confirm_recording += 1;
		}

		for (const [key,value] of Object.entries(recording_dict[confirm_recording])) addAudio(value);

		addButton();
	}
}

function addButton(){
	let new_button = document.createElement('input');
	new_button.type = 'button';

	if (confirm_location == totalAnnotation-1){
		new_button.className = 'btn-confirm';
		new_button.value = 'SUBMIT';
	}
	else{
		new_button.className = 'btn-confirm';
		new_button.value = 'NEXT';
	}

	new_button.style.float = 'right';
	document.getElementById('match-box').appendChild(new_button);

	/*
	if (confirm_location != 0){
		let new_button_last = document.createElement('input');
		new_button_last.type = 'button';
		new_button_last.className = 'btn-confirm';
		new_button_last.value = 'LAST';
		document.getElementById('match-box').appendChild(new_button_last);
	}
	*/
}

function addLocation(coordinates) {
	let new_p = document.createElement('p');
	new_p.innerHTML = 'Sound Sources from the Full Audio:';
	document.getElementById('match-box').appendChild(new_p);

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

function addAudio(recording_name) {
	/*
	for (const [key,value] of Object.entries(matching)) {
		if (recording_name.replace('.wav','') == value) return;
	}
	*/

	const id = recording_name.replace('.wav','');

	let new_div = document.createElement('div');
	new_div.id = 'match-box-'+id;

	let new_input = document.createElement('input');
	new_input.className = 'btn-radio-confirm';
	new_input.id = 'radio'+id;
	new_input.type = 'radio'

	let new_audio = document.createElement('audio');
	new_audio.id = 'audio'+id;
	new_audio.controls = true;
	new_audio.style.display = 'none';

	let new_source = document.createElement('source');
	new_source.type = 'audio/wav';
	new_source.src = '/templates/interface/assets/audio/source/'+id+'.wav';

	new_audio.appendChild(new_source);

	let new_button = document.createElement('button');
	new_button.innerHTML = 'Play Audio';
	new_button.className = 'audio-frame-confirm'
	new_button.id = 'audio-frame-confirm-'+id;

	new_div.appendChild(new_input);
	new_div.appendChild(new_audio);
	new_div.appendChild(new_button);

	document.getElementById('match-box').appendChild(new_div);
	document.getElementById(new_audio.id).load();

	// <div id="match-box-X" >
	// 	<input id="radioX" type="radio">
	// 	<audio id="audioX" controls style="display:none;">
	// 		<source src="/templates/interface/assets/individual_audio/X.wav" type="audio/wav">
	// 	</audio>
	// 	<button class="audio-frame-confirm" id="audio-frame-confirm-X">Play Audio</button>
	// </div>
}

function removeAllElements(){
	let parent = document.getElementById('match-box');
	while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


/* Three.js */

const colors = [0x009dff, 0xff7f0e, 0x00ff00, 0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];

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
		color: colors[number-1]
	});
	var ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.name = 'ball'+number;
	ball.position.set(returnlist['x'], returnlist['y'], returnlist['z']);
	scene.remove(scene.getObjectByName('ball'+number));
	scene.add(ball);
	return ball;
}

function deleteBall(number){ scene.remove(scene.getObjectByName('ball'+number)); }

function removeAllBalls(){
	var index = 0;
	while (index < 10){
		scene.remove(scene.getObjectByName('ball'+(index + 1)));
		index += 1;
	}
}
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