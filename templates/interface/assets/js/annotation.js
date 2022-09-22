/* 
This if statement checks if the user does the screening tests and agrees the consent form 
*/
if (localStorage.getItem('stereo') != '1' || localStorage.getItem('headphone') != '1' || localStorage.getItem('survey_id') == undefined || localStorage.getItem('survey_id') == null){
	window.location = '/templates/interface/incomplete.html';
}

/* 
This if statement checks if a user completes the Practice round 
*/
if (parseInt(localStorage.getItem('complete_practice')) != 1){
	window.location = '/templates/interface/practice.html';
	window.alert("You must complete the Practice Round before entering the Annotation Interface");
}

var survey_id = localStorage.getItem('survey_id');
var practice = 0;
var recording_name = '';
var vertical = -1;
var totalInstructions = 8;
var gaussian = document.querySelector('.gaussian');
const audio_path = 'https://assets-audio.s3.amazonaws.com/audio';
const angle_list=[[0,-90],[0,-75],[90,-75],[180,-75],[270,-75],[100,-70],[270,-72],[90,-71],[0,-71],[90,-71],[180,-71],[270,-71],[0,-70],[5,-70],[10,-70],[15,-70],[20,-70],[25,-70],[30,-70],[35,-70],[40,-70],[45,-70],[50,-70],[55,-70],[60,-70],[65,-70],[70,-70],[75,-70],[80,-70],[85,-70],[90,-70],[95,-70],[100,-70],[105,-70],[110,-70],[115,-70],[120,-70],[125,-70],[130,-70],[135,-70],[140,-70],[145,-70],[150,-70],[155,-70],[160,-70],[165,-70],[170,-70],[175,-70],[180,-70],[185,-70],[190,-70],[195,-70],[200,-70],[205,-70],[210,-70],[215,-70],[220,-70],[225,-70],[230,-70],[235,-70],[240,-70],[245,-70],[250,-70],[255,-70],[260,-70],[265,-70],[270,-70],[275,-70],[280,-70],[285,-70],[290,-70],[295,-70],[300,-70],[305,-70],[310,-70],[315,-70],[320,-70],[325,-70],[330,-70],[335,-70],[340,-70],[345,-70],[350,-70],[355,-70],[10,-70],[90,-69],[100,-70],[190,-70],[270,-69],[280,-70],[340,-70],[45,-65],[65,-70],[135,-65],[225,-65],[245,-70],[315,-65],[0,-63],[0,-60],[5,-60],[10,-60],[15,-60],[20,-60],[25,-60],[30,-60],[35,-60],[40,-60],[45,-60],[50,-60],[55,-60],[60,-60],[65,-60],[70,-60],[75,-60],[80,-60],[85,-60],[90,-60],[95,-60],[100,-60],[105,-60],[110,-60],[115,-60],[120,-60],[125,-60],[130,-60],[135,-60],[140,-60],[145,-60],[150,-60],[155,-60],[160,-60],[165,-60],[170,-60],[175,-60],[180,-60],[185,-60],[190,-60],[195,-60],[200,-60],[205,-60],[210,-60],[215,-60],[220,-60],[225,-60],[230,-60],[235,-60],[240,-60],[245,-60],[250,-60],[255,-60],[260,-60],[265,-60],[270,-60],[275,-60],[280,-60],[285,-60],[290,-60],[295,-60],[300,-60],[305,-60],[310,-60],[315,-60],[320,-60],[325,-60],[330,-60],[335,-60],[340,-60],[345,-60],[350,-60],[355,-60],[0,-58],[60,-60],[90,-58],[150,-60],[180,-58],[240,-60],[270,-58],[330,-60],[231,-51],[30,-50],[58,-54],[122,-54],[210,-50],[238,-54],[302,-54],[10,-50],[45,-51],[130,-50],[135,-51],[225,-51],[250,-50],[315,-51],[0,-50],[5,-50],[10,-50],[15,-50],[20,-50],[25,-50],[30,-50],[35,-50],[40,-50],[45,-50],[50,-50],[55,-50],[60,-50],[65,-50],[70,-50],[75,-50],[80,-50],[85,-50],[90,-50],[95,-50],[100,-50],[105,-50],[110,-50],[115,-50],[120,-50],[125,-50],[130,-50],[135,-50],[140,-50],[145,-50],[150,-50],[155,-50],[160,-50],[165,-50],[170,-50],[175,-50],[180,-50],[185,-50],[190,-50],[195,-50],[200,-50],[205,-50],[210,-50],[215,-50],[220,-50],[225,-50],[230,-50],[235,-50],[240,-50],[245,-50],[250,-50],[255,-50],[260,-50],[265,-50],[270,-50],[275,-50],[280,-50],[285,-50],[290,-50],[295,-50],[300,-50],[305,-50],[310,-50],[315,-50],[320,-50],[325,-50],[330,-50],[335,-50],[340,-50],[345,-50],[350,-50],[355,-50],[160,-50],[340,-50],[45,-47],[135,-47],[225,-47],[315,-47],[130,-46],[230,-46],[0,-45],[45,-45],[65,-50],[90,-45],[135,-45],[155,-50],[180,-45],[225,-45],[240,-42],[270,-45],[315,-45],[335,-50],[0,-44],[72,-44],[144,-44],[216,-44],[288,-44],[120,-40],[0,-40],[5,-40],[10,-40],[15,-40],[20,-40],[25,-40],[25,-40],[30,-40],[35,-40],[40,-40],[45,-40],[50,-40],[55,-40],[60,-40],[65,-40],[70,-40],[75,-40],[80,-40],[85,-40],[90,-40],[95,-40],[100,-40],[105,-40],[110,-40],[115,-40],[115,-40],[120,-40],[125,-40],[130,-40],[135,-40],[140,-40],[145,-40],[150,-40],[155,-40],[160,-40],[165,-40],[170,-40],[175,-40],[180,-40],[185,-40],[190,-40],[195,-40],[200,-40],[205,-40],[205,-40],[210,-40],[215,-40],[220,-40],[225,-40],[230,-40],[235,-40],[240,-40],[245,-40],[250,-40],[255,-40],[260,-40],[265,-40],[270,-40],[275,-40],[280,-40],[285,-40],[290,-40],[295,-40],[295,-40],[300,-40],[305,-40],[310,-40],[315,-40],[320,-40],[325,-40],[330,-40],[335,-40],[340,-40],[345,-40],[350,-40],[355,-40],[110,-40],[290,-40],[60,-40],[180,-40],[300,-40],[270,-40],[45,-35],[135,-35],[225,-35],[315,-35],[0,-32],[90,-32],[180,-32],[190,-30],[270,-32],[350,-30],[0,-30],[5,-30],[10,-30],[15,-30],[20,-30],[21,-30],[25,-30],[30,-30],[35,-30],[40,-30],[45,-30],[50,-30],[55,-30],[60,-30],[65,-30],[70,-30],[70,-30],[75,-30],[80,-30],[85,-30],[90,-30],[95,-30],[100,-30],[105,-30],[110,-30],[115,-30],[120,-30],[125,-30],[130,-30],[135,-30],[140,-30],[145,-30],[150,-30],[155,-30],[159,-30],[160,-30],[165,-30],[170,-30],[175,-30],[180,-30],[185,-30],[190,-30],[195,-30],[200,-30],[201,-30],[205,-30],[210,-30],[215,-30],[220,-30],[225,-30],[230,-30],[235,-30],[240,-30],[245,-30],[250,-30],[250,-30],[255,-30],[260,-30],[265,-30],[270,-30],[275,-30],[280,-30],[285,-30],[290,-30],[295,-30],[300,-30],[305,-30],[310,-30],[315,-30],[320,-30],[325,-30],[330,-30],[335,-30],[339,-30],[340,-30],[345,-30],[350,-30],[355,-30],[33,-29],[57,-29],[123,-29],[147,-29],[213,-29],[237,-29],[303,-29],[327,-29],[15,-30],[105,-30],[195,-30],[285,-30],[65,-20],[10,-20],[190,-20],[0,-21],[85,-20],[175,-20],[180,-21],[265,-20],[355,-20],[0,-20],[5,-20],[10,-20],[15,-20],[20,-20],[25,-20],[30,-20],[35,-20],[40,-20],[45,-20],[50,-20],[55,-20],[60,-20],[65,-20],[70,-20],[75,-20],[80,-20],[85,-20],[90,-20],[95,-20],[95,-20],[100,-20],[105,-20],[110,-20],[115,-20],[120,-20],[125,-20],[130,-20],[135,-20],[140,-20],[145,-20],[150,-20],[155,-20],[160,-20],[165,-20],[170,-20],[175,-20],[180,-20],[185,-20],[190,-20],[195,-20],[200,-20],[205,-20],[210,-20],[215,-20],[215,-20],[220,-20],[225,-20],[230,-20],[235,-20],[240,-20],[245,-20],[250,-20],[255,-20],[260,-20],[265,-20],[270,-20],[275,-20],[280,-20],[285,-20],[290,-20],[295,-20],[300,-20],[305,-20],[310,-20],[315,-20],[320,-20],[325,-20],[330,-20],[335,-20],[335,-20],[340,-20],[345,-20],[350,-20],[355,-20],[0,-19],[30,-20],[90,-19],[150,-20],[180,-19],[270,-19],[18,-18],[30,-20],[50,-20],[58,-18],[72,-18],[108,-18],[122,-18],[140,-20],[162,-18],[198,-18],[210,-20],[230,-20],[238,-18],[252,-18],[288,-18],[302,-18],[320,-20],[342,-18],[180,-19],[0,-19],[62,-16],[298,-16],[0,-15],[62,-16],[90,-15],[148,-18],[180,-15],[238,-18],[270,-15],[332,-19],[0,-14],[90,-14],[140,-10],[180,-14],[270,-14],[320,-10],[36,-12],[108,-12],[180,-12],[252,-12],[324,-12],[65,-10],[245,-10],[0,-10],[5,-10],[10,-10],[15,-10],[20,-10],[25,-10],[30,-10],[35,-10],[40,-10],[45,-10],[50,-10],[55,-10],[60,-10],[65,-10],[70,-10],[75,-10],[80,-10],[85,-10],[90,-10],[95,-10],[100,-10],[105,-10],[110,-10],[115,-10],[120,-10],[125,-10],[130,-10],[135,-10],[140,-10],[145,-10],[150,-10],[155,-10],[160,-10],[165,-10],[170,-10],[175,-10],[180,-10],[185,-10],[190,-10],[195,-10],[200,-10],[205,-10],[210,-10],[215,-10],[220,-10],[225,-10],[230,-10],[235,-10],[240,-10],[245,-10],[250,-10],[255,-10],[260,-10],[265,-10],[270,-10],[275,-10],[280,-10],[285,-10],[290,-10],[295,-10],[300,-10],[305,-10],[310,-10],[315,-10],[320,-10],[325,-10],[330,-10],[335,-10],[340,-10],[345,-10],[350,-10],[355,-10],[290,-10],[22,0],[111,0],[202,0],[291,0],[107,-2],[289,0],[15,0],[135,0],[253,-3],[0,0],[5,0],[10,0],[15,0],[17,0],[19,0],[20,0],[22,0],[25,0],[30,0],[32,0],[35,0],[40,0],[45,0],[50,0],[55,0],[58,0],[60,0],[65,0],[69,0],[69,0],[70,0],[71,0],[75,0],[80,0],[85,0],[90,0],[95,0],[100,0],[105,0],[109,0],[110,0],[111,0],[112,0],[115,0],[120,0],[122,0],[125,0],[130,0],[135,0],[140,0],[145,0],[148,0],[150,0],[155,0],[157,0],[160,0],[161,0],[165,0],[170,0],[175,0],[180,0],[185,0],[190,0],[195,0],[199,0],[200,0],[202,0],[205,0],[210,0],[212,0],[215,0],[215,0],[220,0],[225,0],[230,0],[235,0],[238,0],[240,0],[245,0],[249,0],[249,0],[250,0],[251,0],[255,0],[260,0],[265,0],[270,0],[275,0],[280,0],[285,0],[289,0],[290,0],[291,0],[292,0],[295,0],[300,0],[302,0],[305,0],[310,0],[315,0],[320,0],[325,0],[325,0],[328,0],[330,0],[335,0],[337,0],[340,0],[341,0],[343,0],[345,0],[350,0],[355,0],[45,0],[165,0],[287,3],[73,2],[255,0],[69,0],[160,0],[249,0],[340,0],[250,10],[0,10],[5,10],[10,10],[15,10],[20,10],[25,10],[30,10],[35,10],[40,10],[45,10],[50,10],[55,10],[60,10],[65,10],[70,10],[75,10],[80,10],[85,10],[90,10],[95,10],[100,10],[105,10],[110,10],[115,10],[120,10],[125,10],[130,10],[135,10],[140,10],[145,10],[150,10],[155,10],[160,10],[165,10],[170,10],[175,10],[180,10],[185,10],[190,10],[195,10],[200,10],[205,10],[210,10],[215,10],[220,10],[225,10],[230,10],[235,10],[240,10],[245,10],[250,10],[255,10],[260,10],[265,10],[270,10],[275,10],[280,10],[285,10],[290,10],[295,10],[300,10],[305,10],[310,10],[315,10],[320,10],[325,10],[330,10],[335,10],[340,10],[345,10],[350,10],[355,10],[115,10],[295,10],[0,12],[72,12],[144,12],[216,12],[288,12],[40,10],[45,14],[135,14],[220,10],[225,14],[315,14],[0,15],[32,18],[90,15],[118,16],[180,15],[208,19],[270,15],[302,18],[118,16],[242,16],[0,19],[180,19],[18,18],[40,20],[58,18],[72,18],[108,18],[122,18],[130,20],[150,20],[162,18],[198,18],[220,20],[238,18],[252,18],[288,18],[302,18],[310,20],[330,20],[342,18],[0,19],[30,20],[90,19],[150,20],[180,19],[270,19],[0,20],[5,20],[10,20],[15,20],[20,20],[25,20],[30,20],[35,20],[40,20],[45,20],[50,20],[55,20],[60,20],[65,20],[70,20],[75,20],[80,20],[85,20],[85,20],[90,20],[95,20],[100,20],[105,20],[110,20],[115,20],[120,20],[125,20],[130,20],[135,20],[140,20],[145,20],[150,20],[155,20],[160,20],[165,20],[170,20],[175,20],[180,20],[185,20],[190,20],[195,20],[200,20],[205,20],[205,20],[210,20],[215,20],[220,20],[225,20],[230,20],[235,20],[240,20],[245,20],[250,20],[255,20],[260,20],[265,20],[270,20],[275,20],[280,20],[285,20],[290,20],[295,20],[300,20],[305,20],[310,20],[315,20],[320,20],[325,20],[325,20],[330,20],[335,20],[340,20],[345,20],[350,20],[355,20],[0,21],[5,20],[95,20],[180,21],[185,20],[275,20],[170,20],[350,20],[115,20],[75,30],[165,30],[255,30],[345,30],[33,29],[57,29],[123,29],[147,29],[213,29],[237,29],[303,29],[327,29],[0,30],[5,30],[10,30],[15,30],[20,30],[21,30],[25,30],[30,30],[35,30],[40,30],[45,30],[50,30],[55,30],[60,30],[65,30],[70,30],[75,30],[80,30],[85,30],[90,30],[95,30],[100,30],[105,30],[110,30],[110,30],[115,30],[120,30],[125,30],[130,30],[135,30],[140,30],[145,30],[150,30],[155,30],[159,30],[160,30],[165,30],[170,30],[175,30],[180,30],[185,30],[190,30],[195,30],[200,30],[201,30],[205,30],[210,30],[215,30],[220,30],[225,30],[230,30],[235,30],[240,30],[245,30],[250,30],[255,30],[260,30],[265,30],[270,30],[275,30],[280,30],[285,30],[290,30],[290,30],[295,30],[300,30],[305,30],[310,30],[315,30],[320,30],[325,30],[330,30],[335,30],[339,30],[340,30],[345,30],[350,30],[355,30],[0,32],[90,32],[180,32],[190,30],[270,32],[350,30],[45,35],[135,35],[225,35],[315,35],[270,32],[0,40],[120,40],[240,40],[70,40],[250,40],[0,40],[5,40],[10,40],[15,40],[20,40],[25,40],[30,40],[35,40],[40,40],[45,40],[50,40],[55,40],[60,40],[65,40],[65,40],[70,40],[75,40],[80,40],[85,40],[90,40],[95,40],[100,40],[105,40],[110,40],[115,40],[120,40],[125,40],[130,40],[135,40],[140,40],[145,40],[150,40],[155,40],[155,40],[160,40],[165,40],[170,40],[175,40],[180,40],[185,40],[190,40],[195,40],[200,40],[205,40],[210,40],[215,40],[220,40],[225,40],[230,40],[235,40],[240,40],[245,40],[245,40],[250,40],[255,40],[260,40],[265,40],[270,40],[275,40],[280,40],[285,40],[290,40],[295,40],[300,40],[305,40],[310,40],[315,40],[320,40],[325,40],[330,40],[335,40],[335,40],[340,40],[345,40],[350,40],[355,40],[60,40],[36,44],[108,44],[180,44],[252,44],[324,44],[0,45],[25,40],[45,45],[90,45],[115,40],[135,45],[180,45],[205,40],[225,45],[270,45],[300,42],[315,45],[50,46],[310,46],[45,47],[135,47],[225,47],[315,47],[20,50],[200,50],[0,50],[5,50],[10,50],[15,50],[20,50],[25,50],[30,50],[35,50],[40,50],[45,50],[50,50],[55,50],[60,50],[65,50],[70,50],[75,50],[80,50],[85,50],[90,50],[95,50],[100,50],[105,50],[110,50],[115,50],[120,50],[125,50],[130,50],[135,50],[140,50],[145,50],[150,50],[155,50],[160,50],[165,50],[170,50],[175,50],[180,50],[185,50],[190,50],[195,50],[200,50],[205,50],[210,50],[215,50],[220,50],[225,50],[230,50],[235,50],[240,50],[245,50],[250,50],[255,50],[260,50],[265,50],[270,50],[275,50],[280,50],[285,50],[290,50],[295,50],[300,50],[305,50],[310,50],[315,50],[320,50],[325,50],[330,50],[335,50],[340,50],[345,50],[350,50],[355,50],[0,51],[50,50],[90,51],[170,50],[180,51],[270,51],[290,50],[58,54],[122,54],[150,50],[238,54],[302,54],[330,50],[309,51],[0,58],[30,60],[90,58],[120,60],[180,58],[210,60],[270,58],[300,60],[0,60],[5,60],[10,60],[15,60],[20,60],[25,60],[30,60],[35,60],[40,60],[45,60],[50,60],[55,60],[60,60],[65,60],[70,60],[75,60],[80,60],[85,60],[90,60],[95,60],[100,60],[105,60],[110,60],[115,60],[120,60],[125,60],[130,60],[135,60],[140,60],[145,60],[150,60],[155,60],[160,60],[165,60],[170,60],[175,60],[180,60],[185,60],[190,60],[195,60],[200,60],[205,60],[210,60],[215,60],[220,60],[225,60],[230,60],[235,60],[240,60],[245,60],[250,60],[255,60],[260,60],[265,60],[270,60],[275,60],[280,60],[285,60],[290,60],[295,60],[300,60],[305,60],[310,60],[315,60],[320,60],[325,60],[330,60],[335,60],[340,60],[345,60],[350,60],[355,60],[180,63],[45,65],[115,60],[135,65],[225,65],[295,60],[315,65],[200,70],[80,70],[90,69],[170,70],[260,70],[270,69],[350,70],[0,70],[5,70],[10,70],[15,70],[20,70],[25,70],[30,70],[35,70],[40,70],[45,70],[50,70],[55,70],[60,70],[65,70],[70,70],[75,70],[80,70],[85,70],[90,70],[95,70],[100,70],[105,70],[110,70],[115,70],[120,70],[125,70],[130,70],[135,70],[140,70],[145,70],[150,70],[155,70],[160,70],[165,70],[170,70],[175,70],[180,70],[185,70],[190,70],[195,70],[200,70],[205,70],[210,70],[215,70],[220,70],[225,70],[230,70],[235,70],[240,70],[245,70],[250,70],[255,70],[260,70],[265,70],[270,70],[275,70],[280,70],[285,70],[290,70],[295,70],[300,70],[305,70],[310,70],[315,70],[320,70],[325,70],[330,70],[335,70],[340,70],[345,70],[350,70],[355,70],[0,71],[90,71],[180,71],[270,71],[90,71],[80,70],[270,72],[0,75],[90,75],[180,75],[270,75],[0,80],[5,80],[10,80],[15,80],[20,80],[25,80],[30,80],[35,80],[40,80],[45,80],[50,80],[55,80],[60,80],[65,80],[70,80],[75,80],[80,80],[85,80],[90,80],[95,80],[100,80],[105,80],[110,80],[115,80],[120,80],[125,80],[130,80],[135,80],[140,80],[145,80],[150,80],[155,80],[160,80],[165,80],[170,80],[175,80],[180,80],[185,80],[190,80],[195,80],[200,80],[205,80],[210,80],[215,80],[220,80],[225,80],[230,80],[235,80],[240,80],[245,80],[250,80],[255,80],[260,80],[265,80],[270,80],[275,80],[280,80],[285,80],[290,80],[295,80],[300,80],[305,80],[310,80],[315,80],[320,80],[325,80],[330,80],[335,80],[340,80],[345,80],[350,80],[355,80],[0,90]];

/* 
Creates an AJAX request to the front end to randomly select a recording for the user to annotate 
*/
ajax_select_recording();
function ajax_select_recording(){
	var request_recording = new XMLHttpRequest(); 
	request_recording.open('POST', '/select_recording');
	request_recording.onreadystatechange = function() {
		if (request_recording.readyState == 4){
			vertical = JSON.parse(request_recording.response)["vertical"]["0"] == "0" ? 0 : 1;
			localStorage.setItem('vertical',vertical);
			let file_name = vertical ? "horizontal_vertical" : "horizontal";
			recording_name = JSON.parse(request_recording.response)["recording_name"]["0"];
			document.getElementById('source').src = audio_path+'/recording/'+ file_name + "/" + recording_name;
			document.getElementById('audio').load();
			localStorage.setItem('recording', recording_name);
		}
	}
	request_recording.send();
}

// colors
const colors = [0x009dff, 0xff7f0e, 0x00ff00, 0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];
var current_colors_index = 0;

// prevent deletion and mousemove happen at the same time
var suppress = false;

// prevent moving and clicking happening at the same time
var not_moving = true;

// Location
var curr_azimuth = 0;
var curr_elevation = 0;
var azimuth = new Array();
var elevation = new Array();

// Annotation
var source_count = 0;

// Interaction
var action_type = undefined;
var value = undefined;
var timestamp = undefined;

// this is used to distinguish between adding event and determining event
var key_perform = false;

// user control of audio
var isPlaying = false;

// modal box
var modal = document.getElementById("modal");

// instruction number
var curr_instruction = 1;

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
The listener updates the audio progress bar and plays the audio when the user 
clicks the "Play" button in the instructions window
*/
document.addEventListener('click', function(e){
	if (e.target.id.substring(0,23) == "audio-frame-instruction") {
		isPlaying = false;
		document.getElementById('audio').pause();
		document.getElementById('audio-frame').innerHTML='Play Audio';
		var audios = document.getElementsByClassName('audio-frame-instruction');
		playing_id = ''
		for(let i = 0; i < audios.length; i++) {
			audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
			if (audios[i].id != e.target.id) {
				document.getElementById(audio_id).pause();
				document.getElementById(audios[i].id ).innerHTML = 'Click to Play Sample Audio';
			}
			else {
				playing_id = audio_id;
				document.getElementById(audios[i].id).innerHTML = document.getElementById(audios[i].id).innerHTML == 'Click to Play Sample Audio' ? 'Click to Pause Sample Audio' : 'Click to Play Sample Audio';
				document.getElementById(audios[i].id).innerHTML == 'Click to Play Sample Audio' ? document.getElementById(audio_id).pause() : document.getElementById(audio_id).play();
			}
		}
		document.getElementById(playing_id).addEventListener("timeupdate",function(){
			if (playing_id.replace('audio-','') == e.target.id.replace('audio-frame-instruction-','')) {
				let track = document.getElementById(playing_id).currentTime / document.getElementById(playing_id).duration * 100;
				document.getElementById(e.target.id).style.background = 'linear-gradient(to right, #efefef '+ track +'%, #ffffff 0%)';
			}
		});

		document.getElementById(playing_id).addEventListener("ended",function(){
			document.getElementById(e.target.id).innerHTML = 'Click to Play Sample Audio';
		});
	}
});

/* 
The event listener change the cursor back to its original form whenever a user clicks something.
This event listener specifically changes the cursor shape back when a user selects an action (keyboard event)
and does nothing 
*/
document.querySelector('body').addEventListener("mouseup",function(){
	delete_annotation = false;
	suppress = false;
	document.querySelector('body').style.cursor = 'default';
});

/*
The listener prevents user from getting the contextmenu when he/she does any keyboard or mouse event
This listener prevents user from triggering the browser's default action
*/
document.addEventListener('contextmenu', event => event.preventDefault());
/*
The listener pops up the Keyboard Rule
*/
document.getElementById('key-message').addEventListener("click",popKeyRules);
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
Sends ajax to the backend to the Interaction table for "play audio" action
Changes the "play audio" button to "pause audio" or vice versa
*/
document.getElementById('audio-frame').addEventListener("click",addPlaying);
/*
When the user first finished listening to the audio, a dropdown menu will appear and ask
how many sources the user heard
*/
document.getElementById('audio').addEventListener("ended",displaySelection);
/*
Changes the progress bar color of the audio
*/
document.getElementById('audio').addEventListener("timeupdate",audioTracker);
/*
Record the selected source count to the databse
*/
document.getElementById('count').addEventListener("change",addSourceCount);
/*
Moves the selected azimuth dot on the 2D images up
*/
document.getElementById('azimuth-plus').addEventListener("click",move_azimuth_plus);
/*
Moves the selected elevation dot on the 2D images up
*/
document.getElementById('elevation-plus').addEventListener("click",move_elevation_plus);
/*
Moves the selected azimuth dot on the 2D images down
*/
document.getElementById('azimuth-minus').addEventListener("click",move_azimuth_minus);
/*
Moves the selected elevation dot on the 2D images down
*/
document.getElementById('elevation-minus').addEventListener("click",move_elevation_minus);
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
		let percentage_height = Math.floor(window.innerWidth / 900 * 100) / 100;
		let percentage_width = Math.floor(window.innerHeight / 760 * 100) / 100;

		if (percentage_height < percentage_width) body.style.transform = 'scale(' + percentage_height + ')';
		else body.style.transform = 'scale(' + percentage_width + ')';
	}
}

/*
This method works with the angular distance method to retrieve and play the nearest positioned gaussian audio file
*/
function find_gaussian(true_angles, min, store_index){
    for (let i=0; i<angle_list.length; i++){
		if (Math.floor(true_angles[0]- angle_list[i][0]) > 50 || Math.floor(true_angles[1]- angle_list[i][1]) > 50) continue;
        let dis = angular_distance(true_angles,angle_list[i]);
        if ( dis < min ) {
            min = dis;
            store_index = i;
        }
    }
	gaussian = new Audio("https://assets-audio.s3.amazonaws.com/audio/gaussian/gaussian_rec_" + store_index + ".wav");
	gaussian.play();
	let audio = document.getElementById('audio');
	var noise_down;
	var noise_up;
	gaussian.addEventListener('playing', () => {
		clearInterval(noise_up);
		noise_down = setInterval(function () {
			if (audio.volume > 0.7) audio.volume -= 0.1;
			else clearInterval(noise_down);
		},50);
	});
	gaussian.addEventListener('pause', () => {
		clearInterval(noise_down);
		noise_up = setInterval(function () {
			if (audio.volume < 1) audio.volume += 0.1;
			else clearInterval(noise_up);
		},50);
	});
	return store_index;
}

/*
@params two angles, each indicating the azimuth and elevation in an array
finds the nearest angular distance between two points
*/
function angular_distance(true_angles, estimated_angles) {
    let array = [true_angles[0], 90 - true_angles[1]];
    let value = [estimated_angles[0], 90 - estimated_angles[1]];
    let unit_vect_1 = [array[0] * Math.PI / 180, array[1] * Math.PI / 180];
    let unit_vect_2 = [value[0] * Math.PI / 180, value[1] * Math.PI / 180];
    let dot_product = Math.sin(unit_vect_1[1]) * Math.sin(unit_vect_2[1]) * Math.cos(unit_vect_1[0] - unit_vect_2[0]) + Math.cos(unit_vect_1[1]) * Math.cos(unit_vect_2[1]);
    let distance = Math.acos( Math.round(dot_product * 100000) / 100000 ); // round to decimal place = 5
    return distance;
}

/*
pop Keyboard Rule
*/
function popKeyRules(e){
	e.preventDefault();
	window.alert("Press [Option] or [Alt] key to add an annotation once you see the cursor turning to '+'. Press the [Control] or [Ctrl] key to delete an annotation once you see the cursor turning to '-'. Deleting an annotation means to delete both its annotated horizontal location and vertical location.")
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
	e.preventDefault();
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
		if (curr_instruction == 2) {
			document.getElementById('instruction-video-1').pause();
		}

		if (curr_instruction == 3){
			let audios = document.getElementsByClassName('audio-frame-instruction');
			for (let i = 0; i < audios.length; i++) {
				audio_id = "audio" + audios[i].id.replace("audio-frame-instruction","");
				document.getElementById(audio_id).pause();
				document.getElementById(audios[i].id ).innerHTML = 'Play an Example';
			}
			document.getElementById('instruction-video-1').currentTime = 0;
			document.getElementById('instruction-video-1').play();
		}

		if (curr_instruction == 4) {
			document.getElementById('instruction-video-2').pause();
		}

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

/*
Record user's selected sound sources number from the dropdown menu
and displays 3 2D images and questions that ask the user to annotate those sounds
*/
function addSourceCount(){
	document.querySelector(".container").style.height = "100%";
	document.getElementById('2d-question').innerHTML = "Please identify the location of each sound:";
	document.getElementById('feedback').style.visibility = '';
	document.getElementById('feedback').style.display = 'inline-block';
	document.getElementById('head-wrapper').style.display = 'inline-block';
	document.getElementById('front-wrapper').style.display = 'inline-block';
	document.getElementById('side-wrapper').style.display = 'inline-block';
	document.getElementById('btn-button-submit').setAttribute('style','float:right;');

	source_count = document.getElementById('count').value;
	value = document.getElementById('count').value;
	timestamp = Date.now();
	action_type = "source count";
	ajax_interaction();
}

/*
update the styling of audio progress bar
*/
function audioTracker(){
	let track = document.getElementById('audio').currentTime / document.getElementById('audio').duration * 100;
	document.getElementById('audio-frame').style.background = 'linear-gradient(to right, #efefef '+track+'%, #ffffff 0%)';
}

/*
record user's interaction with audio play button
*/
function addPlaying(e){
	e.preventDefault();
	if (!isPlaying){
		document.getElementById('audio').play();
		document.getElementById('audio-frame').innerHTML='Pause Audio';
		isPlaying = true;

		value = null;
		timestamp = Date.now();
		action_type = "play audio";
		ajax_interaction();
	}
	else{
		isPlaying = false
		document.getElementById('audio').pause();
		document.getElementById('audio-frame').innerHTML='Play Audio';
	}
}

/*
display drop down menu
*/
function displaySelection(){ 
	isPlaying = false;
	document.getElementById('audio-frame').innerHTML='Play Audio';
	document.getElementById('count').style.visibility = '';
}

/*
Warnings associated with annotation
*/
function askProceed(){
	if (document.getElementById('count').value == undefined){ window.alert("You must select a number of distinct sounds"); return false; }
	if (findUndefinedAzimuth() == -3 && findUndefinedElevation() == -3) { window.alert("You must annotate at least one spatial location"); return false; }
	if (findUndefinedAzimuth() != findUndefinedElevation()) { window.alert("You must annotate both the horizontal location and the vertical location to fully annotate each sound's spatial location"); return false; }
	if (findUndefinedAzimuth() == -2 || findUndefinedAzimuth() == -2) { window.alert("You can’t annotate more sounds than the number of distinct sounds selected. Please delete the additional location annotation(s)"); return false; }
	if (findUndefinedAzimuth() != -1 || findUndefinedElevation() != -1 ) { 
		if (confirm("You haven’t annotated all sounds yet (your selected source count is greater than the number of your annotation). Do you still want to proceed?")) return true;
		else return false;
	}
	return true;
}

/*
sends AJAX request to the backend to record user interaction
*/
function ajax_interaction() {
	var request_interaction = new XMLHttpRequest();
	request_interaction.open('POST', '/interaction', true);
	request_interaction.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({survey_id,action_type,value,timestamp,practice});
	request_interaction.send(data);
	request_interaction.onreadystatechange = function() {
		if (request_interaction.readyState == 4){
			if (request_interaction.responseText != 'success'){
				window.alert("Somthing is wrong. Please Refresh.");
				return;
			}
		}
	}
}

/*
This method is triggered after the user clicks the "SUBMIT" button
It directs user to the confirmation page while sends AJAX to the backend to
record user's annotation
*/
function ajax_next(){
	if (!askProceed()){
		event.preventDefault();
		return false;
	}
	var request_next = new XMLHttpRequest();
	let user_note = document.getElementById("user_note").value;
	localStorage.setItem("user_note", user_note);
	timestamp = Date.now();
	request_next.open('POST', '/next', true);
	request_next.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	var data = JSON.stringify({survey_id,recording_name,azimuth,elevation,source_count,timestamp,user_note,practice,vertical});
	request_next.send(data);
	request_next.onreadystatechange = function() {
		if (request_next.readyState == 4){
			if (request_next.responseText != 'success'){
				window.alert("Somthing is wrong. Please Refresh.");
				return;
			}
		}
	}
	localStorage.setItem('practice', 0);
	localStorage.setItem('practice_boolean', 0);
	window.location = '/templates/interface/confirm.html';
}

/*
This method is used to detect if the annotation dot should be displayed in both
side (Back side and Side side) of the 2D images for elevation annotation
*/
function displayBoth(hasFront, index, temp_azimuth, degree){
	if (hasFront){
		if (temp_azimuth < 22.5 || temp_azimuth > 337.5){ 
			document.getElementById('front-item-'+index).style.display = 'none';
			document.getElementById('circularF'+index).style.display = 'none';

			document.getElementById('side-item-'+index).style.display = '';
			document.getElementById('circularS'+index).style.display = '';
			document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else if (temp_azimuth > 67.5 && temp_azimuth < 112.5){
			document.getElementById('side-item-'+index).style.display = 'none';
			document.getElementById('circularS'+index).style.display = 'none';
			document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else if (temp_azimuth > 157.5 && temp_azimuth < 202.5){ 
			document.getElementById('front-item-'+index).style.display = 'none';
			document.getElementById('circularF'+index).style.display = 'none';

			document.getElementById('side-item-'+index).style.display = '';
			document.getElementById('circularS'+index).style.display = '';
			document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else if (temp_azimuth > 247.5 && temp_azimuth < 292.5){
			document.getElementById('side-item-'+index).style.display = 'none';
			document.getElementById('circularS'+index).style.display = 'none';
			document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else{ // When Both Items Should Be Displayed

			// Adjust Side Items
			document.getElementById('side-item-'+index).style.display = '';
			document.getElementById('circularS'+index).style.display = '';

			if (temp_azimuth > 270 || temp_azimuth < 90){
				if (degree > 180) { document.getElementById('circularS'+index).style.transform = 'rotate('+(360-degree)+'deg)'; }
				else { document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)'; }
			}
			else if (temp_azimuth < 270 && temp_azimuth > 90){
				if (degree < 180) { document.getElementById('circularS'+index).style.transform = 'rotate('+(360-degree)+'deg)'; }
				else { document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)'; }
			}

			// Adjust Front Items
			document.getElementById('front-item-'+index).style.display = '';
			document.getElementById('circularF'+index).style.display = '';

			if (temp_azimuth < 180){
				if (degree > 180){ document.getElementById('circularF'+index).style.transform = 'rotate('+(360-degree)+'deg)'; }
				else{ document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)';  }
			}
			else if (temp_azimuth > 180){
				if (degree < 180){ document.getElementById('circularF'+index).style.transform = 'rotate('+(360-degree)+'deg)';  }
				else{ document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)'; }
			}
		}
	}
	if (!hasFront){
		if (temp_azimuth < 22.5 || temp_azimuth > 337.5){ 
			document.getElementById('front-item-'+index).style.display = 'none';
			document.getElementById('circularF'+index).style.display = 'none';
			document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else if (temp_azimuth > 67.5 && temp_azimuth < 112.5){
			document.getElementById('side-item-'+index).style.display = 'none';
			document.getElementById('circularS'+index).style.display = 'none';

			document.getElementById('front-item-'+index).style.display = '';
			document.getElementById('circularF'+index).style.display = '';
			document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else if (temp_azimuth > 157.5 && temp_azimuth < 202.5){ 
			document.getElementById('front-item-'+index).style.display = 'none';
			document.getElementById('circularF'+index).style.display = 'none';
			document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else if (temp_azimuth > 247.5 && temp_azimuth < 292.5){
			document.getElementById('side-item-'+index).style.display = 'none';
			document.getElementById('circularS'+index).style.display = 'none';

			document.getElementById('front-item-'+index).style.display = '';
			document.getElementById('circularF'+index).style.display = '';
			document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)';
		}
		else{ // When Both Items Should Be Displayed

			// Adjust Side Items
			document.getElementById('side-item-'+index).style.display = '';
			document.getElementById('circularS'+index).style.display = '';

			if (temp_azimuth > 270 || temp_azimuth < 90){
				if (degree > 180) { document.getElementById('circularS'+index).style.transform = 'rotate('+(360-degree)+'deg)'; }
				else { document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)'; }
			}
			else if (temp_azimuth < 270 && temp_azimuth > 90){
				if (degree < 180) { document.getElementById('circularS'+index).style.transform = 'rotate('+(360-degree)+'deg)'; }
				else { document.getElementById('circularS'+index).style.transform = 'rotate('+degree+'deg)'; }
			}

			// Adjust Front Items
			document.getElementById('front-item-'+index).style.display = '';
			document.getElementById('circularF'+index).style.display = '';

			if (temp_azimuth < 180){
				if (degree > 180){ document.getElementById('circularF'+index).style.transform = 'rotate('+(360-degree)+'deg)'; }
				else{ document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)';  }
			}
			else if (temp_azimuth > 180){
				if (degree < 180){ document.getElementById('circularF'+index).style.transform = 'rotate('+(360-degree)+'deg)';  }
				else{ document.getElementById('circularF'+index).style.transform = 'rotate('+degree+'deg)'; }
			}
		}
	}
}

/*
This method is used to change the annotation dot side when two or more dots are closed to each other
When the distance between two or more dots is 5 degree (of 360 degree), then the size of the dots
will change with the bottom dots having a larger size than the top dots
*/
function changeSize(item_index){

	const selected_azimuth = azimuth[item_index - 1];
	let size = 18 - 8;
	let margin_top = -65 + 4;
	let margin_left = 0 + 4;

	for ( let index = azimuth.length - 1; index > -1; index-- ){
		if ( selected_azimuth != undefined && Math.abs( selected_azimuth - azimuth[index] ) <= 5) {
			if ( index != (item_index - 1) ){
				indicators[item_index][index] = true;
				indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('head-item-'+(index + 1)).style.width = size.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.fontSize = (size - 3).toString() + 'px';

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
	const selected_elevation_degree = parseInt(document.getElementById('circularF'+item_index).style.transform.replace('rotate(','').replace('deg)',''));
	
	size = 18 - 8;
	margin_top = -65 + 4;
	margin_left = 0 + 4;

	for ( let index = elevation.length - 1; index > -1; index-- ) {
		const current_index_degree = document.getElementById('circularF'+(index+1)).style.display != 'none' ? parseInt(document.getElementById('circularF'+(index+1)).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation != undefined && Math.abs( selected_elevation_degree - current_index_degree ) <= 5 ) {
			if ( index != (item_index - 1) ){
				front_indicators[item_index][index] = true;
				front_indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('front-item-'+(index + 1)).style.width = size.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.fontSize = (size - 3).toString() + 'px';

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
	const selected_elevation_degree2 = parseInt(document.getElementById('circularS'+item_index).style.transform.replace('rotate(','').replace('deg)',''));
	
	size = 18 - 8;
	margin_top = -65 + 4;
	margin_left = 0 + 4;

	for ( let index = elevation.length - 1; index > -1; index-- ) {
		const current_index_degree2 = document.getElementById('circularS'+(index+1)).style.display != 'none' ? parseInt(document.getElementById('circularS'+(index+1)).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation2 != undefined && Math.abs( selected_elevation_degree2 - current_index_degree2 ) <= 5 ) {
			if ( index != (item_index - 1) ){
				side_indicators[item_index][index] = true;
				side_indicators[index+1][item_index-1] = true;
			}

			size = size + 8;
			margin_top = margin_top - 4;
			margin_left = margin_left - 4;

			document.getElementById('side-item-'+(index + 1)).style.width = size.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.marginLeft = margin_left.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.fontSize = (size - 3).toString() + 'px';

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

/*
This method is triggered when the user clicks the "+" sign
It controls the selected azimuth dot of the 2D image and moves it up
*/
function move_azimuth_plus(e){
	e.preventDefault();

	if (document.getElementById('head-item-'+(current_colors_index+1)).style.display == 'none'){
		window.alert("Please annotate the sound first using the 2D views"); 
		return false; 
	}

	temp_azimuth = parseInt(document.getElementById('p-azimuth').innerHTML) + 1;
	temp_azimuth = (temp_azimuth == 360 ? temp_azimuth = 0 : temp_azimuth);

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circularF'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if ((temp_azimuth < 180 && degree > 180) || (temp_azimuth > 180 && degree < 180)){ degree = 360 - degree; }
		displayBoth(true, (current_colors_index+1), temp_azimuth, degree);
	}

	if (document.getElementById('side-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circularS'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if ( ((temp_azimuth > 270 || temp_azimuth < 90) && degree>180)
		|| ((temp_azimuth < 270 && temp_azimuth > 90) && degree<180) ){ degree = 360 - degree; }
		displayBoth(false, (current_colors_index+1), temp_azimuth, degree);
	}

	document.getElementById('p-azimuth').innerHTML = temp_azimuth + ' degrees';
	azimuth[current_colors_index] = temp_azimuth;
	document.getElementById('circular'+(current_colors_index+1)).style.transform = 'rotate('+temp_azimuth+'deg)';
	changeSize(current_colors_index+1);
	current_elevation = (elevation[current_colors_index] == undefined ? 0 : elevation[current_colors_index]);
	displayBall((azimuth[current_colors_index]-180), current_elevation, (current_colors_index+1));

	if (elevation[current_colors_index] != null) find_gaussian([azimuth[current_colors_index], elevation[current_colors_index]], Number.MAX_VALUE, -1);

	value = temp_azimuth;
	timestamp = Date.now();
	action_type = 'azimuth';
	ajax_interaction();
}

/*
This method is triggered when the user clicks the "-" sign
It controls the selected azimuth dot of the 2D image and moves it down
*/
function move_azimuth_minus(e){
	e.preventDefault();

	if (document.getElementById('head-item-'+(current_colors_index+1)).style.display == 'none'){ 
		window.alert("Please annotate the sound first using the 2D views"); 
		return false; 
	}

	temp_azimuth = parseInt(document.getElementById('p-azimuth').innerHTML) - 1;
	temp_azimuth = (temp_azimuth == 360 ? temp_azimuth = 0 : temp_azimuth);
	temp_azimuth = (temp_azimuth == -1 ? temp_azimuth = 359 : temp_azimuth);

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circularF'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if ((temp_azimuth < 180 && degree > 180) || (temp_azimuth > 180 && degree < 180)){ degree = 360 - degree; }
		displayBoth(true, (current_colors_index+1), temp_azimuth, degree);
	}

	if (document.getElementById('side-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circularS'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if ( ((temp_azimuth > 270 || temp_azimuth < 90) && degree>180)
		|| ((temp_azimuth < 270 && temp_azimuth > 90) && degree<180) ){ degree = 360 - degree; }
		displayBoth(false, (current_colors_index+1), temp_azimuth, degree);
	}

	document.getElementById('p-azimuth').innerHTML = temp_azimuth + ' degrees';
	azimuth[current_colors_index] = temp_azimuth;
	document.getElementById('circular'+(current_colors_index+1)).style.transform = 'rotate('+temp_azimuth+'deg)';
	changeSize(current_colors_index+1);
	current_elevation = (elevation[current_colors_index] == undefined ? 0 : elevation[current_colors_index]);
	displayBall((azimuth[current_colors_index]-180), current_elevation, (current_colors_index+1));

	if (elevation[current_colors_index] != null) find_gaussian([azimuth[current_colors_index], elevation[current_colors_index]], Number.MAX_VALUE, -1);

	value = temp_azimuth;
	timestamp = Date.now();
	action_type = 'azimuth';
	ajax_interaction();
}

/*
This method is triggered when the user clicks the "+" sign
It controls the selected elevation dot of the 2D image and moves it up
*/
function move_elevation_plus(e){
	e.preventDefault();

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display == 'none' 
	&& document.getElementById('side-item-'+(current_colors_index+1)).style.display == 'none' ){
		window.alert("Please annotate the sound first using the 2D views"); 
		return false; 
	}

	new_elevation = parseInt(document.getElementById('p-elevation').innerHTML) + 1;
	if (new_elevation > 90) { return false; }

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display != 'none'){
		document.getElementById('p-elevation').innerHTML = new_elevation + ' degrees';
		elevation[current_colors_index] = new_elevation;

		old_elevation_degree = parseInt(document.getElementById('circularF'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));
		if (old_elevation_degree < 180){
			new_elevation_degree = old_elevation_degree-1;
			document.getElementById('circularF'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
		else {
			new_elevation_degree = old_elevation_degree+1;
			document.getElementById('circularF'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
	}
	if (document.getElementById('side-item-'+(current_colors_index+1)).style.display != 'none'){
		document.getElementById('p-elevation').innerHTML = new_elevation + ' degrees';
		elevation[current_colors_index] = new_elevation;

		old_elevation_degree = parseInt(document.getElementById('circularS'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));
		if (old_elevation_degree < 180){
			new_elevation_degree = old_elevation_degree-1;
			document.getElementById('circularS'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
		else {
			new_elevation_degree = old_elevation_degree+1;
			document.getElementById('circularS'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
	}

	changeSize(current_colors_index+1);

	if (azimuth[current_colors_index] != null) find_gaussian([azimuth[current_colors_index], elevation[current_colors_index]], Number.MAX_VALUE, -1);

	value = new_elevation;
	timestamp = Date.now();
	action_type = 'elevation';
	ajax_interaction();
}

/*
This method is triggered when the user clicks the "-" sign
It controls the selected elevation dot of the 2D image and moves it down
*/
function move_elevation_minus(e){
	e.preventDefault();
	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display == 'none' && document.getElementById('side-item-'+(current_colors_index+1)).style.display == 'none' ){ 
		window.alert("Please annotate the sound first using the 2D views"); 
		return false; 
	}

	new_elevation = parseInt(document.getElementById('p-elevation').innerHTML) - 1;
	if (new_elevation < (-90)) { return false; }

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circular'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));
		document.getElementById('p-elevation').innerHTML = new_elevation + ' degrees';
		elevation[current_colors_index] = new_elevation;

		old_elevation_degree = parseInt(document.getElementById('circularF'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if (old_elevation_degree < 180){
			new_elevation_degree = old_elevation_degree+1;
			document.getElementById('circularF'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
		else {
			new_elevation_degree = old_elevation_degree-1;
			document.getElementById('circularF'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
	}
	if (document.getElementById('side-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circular'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));
		document.getElementById('p-elevation').innerHTML = new_elevation + ' degrees';
		elevation[current_colors_index] = new_elevation;

		old_elevation_degree = parseInt(document.getElementById('circularS'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if (old_elevation_degree < 180){
			new_elevation_degree = old_elevation_degree+1;
			document.getElementById('circularS'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
		else {
			new_elevation_degree = old_elevation_degree-1;
			document.getElementById('circularS'+(current_colors_index+1)).style.transform = 'rotate('+new_elevation_degree+'deg)';
			displayBall((azimuth[current_colors_index]==undefined ? -180 : azimuth[current_colors_index]-180), new_elevation, (current_colors_index+1));
		}
	}

	changeSize(current_colors_index+1);

	if (azimuth[current_colors_index] != null) find_gaussian([azimuth[current_colors_index], elevation[current_colors_index]], Number.MAX_VALUE, -1);

	value = new_elevation;
	timestamp = Date.now();
	action_type = 'elevation';
	ajax_interaction();
}

/*
This method allows user to drag and moves the annotated dot
It also updates the degree info of the annotated dot
Keep in mind that not all dots are allowed to be dragged (i.e. if the position of an elevation dot
	does not match with that of the azimuth dot, a warning will pop up)
*/
function dragElement(index,indicator,add_index){
	var item, itemF, itemS;

	item = document.getElementById('circular'+index); 
	inner_item = document.getElementById('head-item-'+index); 
	frame = document.getElementById('head');

	itemF = document.getElementById('circularF'+index); 
	inner_itemF = document.getElementById('front-item-'+index); 
	frameF = document.getElementById('front');

	itemS = document.getElementById('circularS'+index); 
	inner_itemS = document.getElementById('side-item-'+index); 
	frameS = document.getElementById('side');

	original_head_degree = parseInt(document.getElementById('circular'+index).style.transform.replace('rotate(','').replace('deg)',''));
	original_front_degree = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));
	original_side_degree = parseInt(document.getElementById('circularS'+index).style.transform.replace('rotate(','').replace('deg)',''));

	itemS.onmousedown = function(){
		if(suppress) {
			// prevent undesired behaviors
			document.onmousedown = null;
			document.onmouseup = null;
			document.onmousemove = null;
			return;
		}

		document.onmousemove = mouse;
		document.onmouseup = function(){
			if(not_moving){
				if (azimuth[add_index] != null) find_gaussian([azimuth[add_index], elevation[add_index]], Number.MAX_VALUE, -1);

				// prevent undesired behaviors
				document.onmousedown = null;
				document.onmouseup = null;
				document.onmousemove = null;
				return;
			}

			temp_azimuthS = parseInt(document.getElementById('circularS'+index).style.transform.replace('rotate(','').replace('deg)',''));

			if (document.getElementById('head-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circular'+index).style.transform.replace('rotate(','').replace('deg)',''));

				if ( ((degree < 90 || degree > 270) && (temp_azimuthS > 180)) || ((degree > 90 && degree < 270) && (temp_azimuthS < 180)) ){
					window.alert("The annotation for the vertical location is inconsistent with the annotation for the horizontal location");
					itemS.style.transform = 'rotate('+original_side_degree+'deg)';
					document.getElementById('p-elevation').innerHTML = elevation[add_index] + " degrees"

					// prevent undesired behaviors
					document.onmousedown = null;
					document.onmouseup = null;
					document.onmousemove = null;
					return;
				}

				if (azimuth[add_index] >= 22.5 && azimuth[add_index] <= 67.5) {
					document.getElementById('circularF'+index).setAttribute('style','');
					document.getElementById('circularF'+index).style.transform = 'rotate('+temp_azimuthS+'deg)';
					document.getElementById('front-item-'+index).setAttribute('style','');
				}
				else if (azimuth[add_index] >= 112.5 && azimuth[add_index] <= 157.5) {
					document.getElementById('circularF'+index).setAttribute('style','');
					document.getElementById('circularF'+index).style.transform = 'rotate('+(360-temp_azimuthS)+'deg)';
					document.getElementById('front-item-'+index).setAttribute('style','');
				}
				else if (azimuth[add_index] >= 202.5 && azimuth[add_index] <= 247.5) {
					document.getElementById('circularF'+index).setAttribute('style','');
					document.getElementById('circularF'+index).style.transform = 'rotate('+temp_azimuthS+'deg)';
					document.getElementById('front-item-'+index).setAttribute('style','');
				}
				else if (azimuth[add_index] >= 292.5 && azimuth[add_index] <= 337.5) {
					document.getElementById('circularF'+index).setAttribute('style','');
					document.getElementById('circularF'+index).style.transform = 'rotate('+(360-temp_azimuthS)+'deg)';
					document.getElementById('front-item-'+index).setAttribute('style','');
				}
				else{
					document.getElementById('front-item-'+index).style.display = 'none';
					document.getElementById('circularF'+index).style.display = 'none';
				}
			}

			displayBall( (azimuth[add_index] != undefined ? azimuth[add_index] - 180 : -180) , curr_elevation, index);
			elevation[add_index] = curr_elevation;

			changeSize(index);

			if (azimuth[add_index] != null) find_gaussian([azimuth[add_index], elevation[add_index]], Number.MAX_VALUE, -1);

			value = curr_elevation;
			timestamp = Date.now();
			action_type = "elevation";
			ajax_interaction();

			not_moving = true;

			// prevent undesired behaviors
			document.onmousedown = null;
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	itemF.onmousedown = function(){
		if(suppress) {
			// prevent undesired behaviors
			document.onmousedown = null;
			document.onmouseup = null;
			document.onmousemove = null;
			return; 
		}

		document.onmousemove = mouse;
		document.onmouseup = function(e){
			if (not_moving){
				if (azimuth[add_index] != null) find_gaussian([azimuth[add_index], elevation[add_index]], Number.MAX_VALUE, -1);

				// prevent undesired behaviors
				document.onmousedown = null;
				document.onmouseup = null;
				document.onmousemove = null;
				return;
			}

			temp_azimuthF = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));

			if (document.getElementById('head-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circular'+index).style.transform.replace('rotate(','').replace('deg)',''));

				if ( (degree < 180 && temp_azimuthF > 180) || (degree > 180 && temp_azimuthF < 180) ){
					window.alert("The annotation for the vertical location is inconsistent with the annotation for the horizontal location");
					itemF.style.transform = 'rotate('+original_front_degree+'deg)';
					document.getElementById('p-elevation').innerHTML = elevation[add_index] + " degrees"

					// prevent undesired behaviors
					document.onmousedown = null;
					document.onmouseup = null;
					document.onmousemove = null;
					return;
				}

				if (azimuth[add_index] >= 22.5 && azimuth[add_index] <= 67.5) {
					document.getElementById('circularS'+index).setAttribute('style','');
					document.getElementById('circularS'+index).style.transform = 'rotate('+temp_azimuthF+'deg)';
					document.getElementById('side-item-'+index).setAttribute('style','');
				}
				else if (azimuth[add_index] >= 112.5 && azimuth[add_index] <= 157.5) {
					document.getElementById('circularS'+index).setAttribute('style','');
					document.getElementById('circularS'+index).style.transform = 'rotate('+(360-temp_azimuthF)+'deg)';
					document.getElementById('side-item-'+index).setAttribute('style','');
				}
				else if (azimuth[add_index] >= 202.5 && azimuth[add_index] <= 247.5) {
					document.getElementById('circularS'+index).setAttribute('style','');
					document.getElementById('circularS'+index).style.transform = 'rotate('+temp_azimuthF+'deg)';
					document.getElementById('side-item-'+index).setAttribute('style','');
				}
				else if (azimuth[add_index] >= 292.5 && azimuth[add_index] <= 337.5) {
					document.getElementById('circularS'+index).setAttribute('style','');
					document.getElementById('circularS'+index).style.transform = 'rotate('+(360-temp_azimuthF)+'deg)';
					document.getElementById('side-item-'+index).setAttribute('style','');
				}
				else{
					document.getElementById('side-item-'+index).style.display = 'none';
					document.getElementById('circularS'+index).style.display = 'none';
				}
			}

			displayBall( (azimuth[add_index] != undefined ? azimuth[add_index] - 180 : -180) , curr_elevation, index);
			elevation[add_index] = curr_elevation;

			changeSize(index);

			if (azimuth[add_index] != null) find_gaussian([azimuth[add_index], elevation[add_index]], Number.MAX_VALUE, -1);

			value = curr_elevation;
			timestamp = Date.now();
			action_type = "elevation";
			ajax_interaction();

			not_moving = true;

			// prevent undesired behaviors
			document.onmousedown = null;
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	item.onmousedown = function() {
		if(suppress) {
			// prevent undesired behaviors
			document.onmousedown = null;
			document.onmouseup = null;
			document.onmousemove = null;
			return; 
		}

   		document.onmousemove = mouse;
		document.onmouseup = function(e) {
			if (not_moving){
				if (elevation[add_index] != null) find_gaussian([azimuth[add_index], elevation[add_index]], Number.MAX_VALUE, -1);

				// prevent undesired behaviors
				document.onmousedown = null;
				document.onmouseup = null;
				document.onmousemove = null;
				return;
			}

			temp_azimuth = parseInt(document.getElementById('p-azimuth').innerHTML);

			if (document.getElementById('front-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));
				if ((temp_azimuth < 180 && degree > 180) || (temp_azimuth > 180 && degree < 180)){ degree = 360 - degree; }
				displayBoth(true, index, temp_azimuth, degree);
			}

			if (document.getElementById('side-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circularS'+index).style.transform.replace('rotate(','').replace('deg)',''));
				if ( ((temp_azimuth > 270 || temp_azimuth < 90) && degree>180) || ((temp_azimuth < 270 && temp_azimuth > 90) && degree<180) ){ degree = 360 - degree; }
				displayBoth(false, index, temp_azimuth, degree);
			}

			displayBall(temp_azimuth-180, (elevation[add_index] != undefined ? elevation[add_index] : 0), index);
			curr_azimuth = temp_azimuth;
			azimuth[add_index] = curr_azimuth;

			changeSize(index);

			if (elevation[add_index] != null) find_gaussian([azimuth[add_index], elevation[add_index]], Number.MAX_VALUE, -1);

			value = curr_azimuth;
			timestamp = Date.now();
			action_type = "elevation";
			ajax_interaction();

			not_moving = true;

			// prevent undesired behaviors
			document.onmousedown = null;
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	function mouse(e) {
		if (indicator == 1) {
			var ilocationF = itemF.getBoundingClientRect();
			var cxF = (ilocationF.right + ilocationF.left) / 2;
			var cyF = (ilocationF.top + ilocationF.bottom) / 2;
			var temp_azimuthF = calculateAzimuth(e.pageX, e.pageY, cxF, cyF);
			temp_azimuthF = (temp_azimuthF == 360 ? 0 : temp_azimuthF);

			if (temp_azimuthF <= 180){ curr_elevation = 90 - temp_azimuthF; }
			else{ curr_elevation = (temp_azimuthF - 180) - 90 }

			itemF.style.transform = 'rotate('+temp_azimuthF+'deg)';
			document.getElementById('p-azimuth').innerHTML = (azimuth[add_index] != undefined ? azimuth[add_index] : 0) + " degrees";
			document.getElementById('p-elevation').innerHTML = curr_elevation + " degrees";
		}
		else if (indicator == 2){
			var ilocationS = itemS.getBoundingClientRect();
			var cxS = (ilocationS.right + ilocationS.left) / 2;
			var cyS = (ilocationS.top + ilocationS.bottom) / 2;
			var temp_azimuthS = calculateAzimuth(e.pageX, e.pageY, cxS, cyS);
			temp_azimuthS = (temp_azimuthS == 360 ? 0 : temp_azimuthS);

			if (temp_azimuthS <= 180){ curr_elevation = 90 - temp_azimuthS; }
			else{ curr_elevation = (temp_azimuthS - 180) - 90 }

			itemS.style.transform = 'rotate('+temp_azimuthS+'deg)';
			document.getElementById('p-azimuth').innerHTML = (azimuth[add_index] != undefined ? azimuth[add_index] : 0) + " degrees";
			document.getElementById('p-elevation').innerHTML = curr_elevation + " degrees";
		}
		else{
			var ilocation = item.getBoundingClientRect();
			var cx = (ilocation.right + ilocation.left) / 2;
			var cy = (ilocation.top + ilocation.bottom) / 2;
			var temp_azimuth = calculateAzimuth(e.pageX, e.pageY, cx, cy);
			temp_azimuth = (temp_azimuth == 360 ? 0 : temp_azimuth);

			item.style.transform = 'rotate('+temp_azimuth+'deg)';
			document.getElementById('p-azimuth').innerHTML = temp_azimuth + " degrees";
			document.getElementById('p-elevation').innerHTML = (elevation[add_index] != undefined ? elevation[add_index] : 0) + " degrees";
		}
		suppress = false;
		not_moving = false;
	}
}

/*
This method calculates the azimuth of an annotation
*/
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

/*
This method manipulates the array that is used to store the annotated azimuth information
It lets the other method know what is the smallest index to insert a new azimuth (which tells
	the interface what color or what annotation dot should the user use)
*/
function findUndefinedAzimuth(){
	var index = 0;
	var lock = 0;
	var azimuth_item_index = 0;
	var azimuth_count = 0;
	var find_undefined = false;

	if (azimuth.length > source_count) lock = azimuth.length
	else lock = source_count;

	while ( index < lock ){
		if ( azimuth[index] == undefined && !find_undefined ){
			azimuth_item_index = index;
			find_undefined = true;
		}
		if ( azimuth[index] != undefined ) azimuth_count += 1;
		index += 1;
	}

	if (azimuth_count == 0 && !key_perform) return -3; // when user hit 'submit' but there is no annotation
	if (azimuth_count > source_count) return -2; // when user hit submit but annotate more annotation
	if (azimuth_count == source_count) return -1; // when user hit submit and annotate all annotation(s)
	else return azimuth_item_index; // when user hit submit but annotate less annotation(s)
}

/*
This method manipulates the array that is used to store the annotated elevation information
It lets the other method know what is the smallest index to insert a new elevation (which tells
	the interface what color or what annotation dot should the user use)
*/
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

/*
This method measures the distance between mouse clicked position and the 2D images
It is used to determine if the user clicks to the blue circle of the 2D images
*/
function calculateRadius(mouseX, mouseY, frameX, frameY){
	x = frameX - mouseX;
	y = frameY - mouseY;
	radius = Math.sqrt( Math.pow(x,2) + Math.pow(y,2) );
	if ( radius <= 100 ) return true;
	else return false;
}

/*
This method pops up a warning when the user clicks the 3D display
since the display is not for annotation
*/
function calculate3dClick(mouseX, mouseY, frameX, frameY){
	x = frameX - mouseX;
	y = frameY - mouseY;
	radius = Math.sqrt( Math.pow(x,2) + Math.pow(y,2) );
	if ( radius <= 200 ) return true;
	else return false;
}

var enable_head = false;
var enable_front = false;
var enable_side = false;
var delete_annotation = false;
var add_third = false;

document.addEventListener("keydown", keyboardEvents);

/*
This method holds a collection of event listeners for adding annotation dot in the three 2D images
and triggering the deletion event
It changes the cursor shape and updates the arrays for storing azimuth and elevation
*/
function keyboardEvents(e){

	if(e.ctrlKey){
		e.preventDefault();
		
		document.querySelector('body').style.cursor = "url('/templates/interface/img/minus.svg'), auto";
		// disable adding events
		enable_head = false; 
		enable_front = false; 
		enable_side = false;
		// enable deleting events
		delete_annotation = true;
		// prevent dragging event
		suppress = true;
		return;
	}

	// set up to get location
	document.getElementById('circular').setAttribute('style','');
	document.getElementById('circularF').setAttribute('style','');
	document.getElementById('circularS').setAttribute('style','');

	head_frameLocation = document.getElementById('circular').getBoundingClientRect();
	front_frameLocation = document.getElementById('circularF').getBoundingClientRect();
	side_frameLocation = document.getElementById('circularS').getBoundingClientRect();
	three_frameLocation = document.getElementById('3d-head').getBoundingClientRect();

	head_cx = ( head_frameLocation.right + head_frameLocation.left ) / 2;
	head_cy = ( head_frameLocation.top + head_frameLocation.bottom ) / 2;
	front_cx = ( front_frameLocation.right + front_frameLocation.left ) / 2;
	front_cy = ( front_frameLocation.top + front_frameLocation.bottom ) / 2;
	side_cx = ( side_frameLocation.right + side_frameLocation.left ) / 2;
	side_cy = ( side_frameLocation.top + side_frameLocation.bottom ) / 2;
	three_cx = ( three_frameLocation.right + three_frameLocation.left ) / 2;
	three_cy = ( three_frameLocation.top + three_frameLocation.bottom ) / 2;
	
	if (e.altKey){
		e.preventDefault();

		// disable deleting events
		delete_annotation = false;
		
		document.querySelector('body').style.cursor = 'cell';

		key_perform = true;

		var azimuth_item_index = findUndefinedAzimuth();
		var elevation_item_index = findUndefinedElevation();

		// disable drag events
		suppress = true;

		document.addEventListener('click', function(e){
			e.preventDefault();

			enable_head = calculateRadius(e.pageX, e.pageY, head_cx, head_cy);
			enable_front = calculateRadius(e.pageX, e.pageY, front_cx, front_cy);
			enable_side = calculateRadius(e.pageX, e.pageY, side_cx, side_cy);
			click_3d_head = calculate3dClick(e.pageX, e.pageY, three_cx, three_cy);

			if (click_3d_head){
				window.alert("Please annotate the sound using the 2D views"); 
				document.querySelector('body').style.cursor = 'default';
				key_perform = false;
				document.onclick = null;
				document.onkeydown = null; 
				return;
			}

			if (enable_head){
				if ( azimuth_item_index == -1 ){
					window.alert("You have already annotated " + source_count + " horizontal locations. Please update the number of distinct sounds before continuing."); 
					document.querySelector('body').style.cursor = 'default'; 
					key_perform = false;
					enable_head = false;
					// prevent undesired events
					document.onclick = null;
					document.onkeydown = null; 
					return;
				}

				if ((azimuth_item_index > elevation_item_index) && elevation_item_index != -1) {
					window.alert("You must annotate a vertical location before adding a new sound annotation"); 
					document.querySelector('body').style.cursor = 'default'; 
					key_perform = false;
					enable_head = false;

					// prevent undesired events
					document.onclick = null;
					document.onkeydown = null; 
					return;
				}

				azimuth_item_index += 1;
				curr_azimuth = calculateAzimuth(e.pageX, e.pageY, head_cx, head_cy);
				curr_azimuth = (curr_azimuth == 360 ? 0 : curr_azimuth);

				if ( document.getElementById('front-item-'+azimuth_item_index).style.display != 'none' ){
					original_front = parseInt(document.getElementById('circularF'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));
					if ( (original_front < 180 && curr_azimuth > 180) || (original_front > 180 && curr_azimuth < 180) ) {
						window.alert("The annotation for the horizontal location is inconsistent with the annotation for the vertical location"); 
						document.querySelector('body').style.cursor = 'default'; 
						key_perform = false;
						enable_head = false;
						document.onclick = null;
						document.onkeydown = null;
						return;
					}

					degree = parseInt(document.getElementById('circularF'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));
					
					if ((curr_azimuth < 180 && degree > 180) || (curr_azimuth > 180 && degree < 180)){
						document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)';
					}

					if (curr_azimuth < 22.5 || curr_azimuth > 337.5){
						document.getElementById('front-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularF'+azimuth_item_index).style.display = 'none';

						document.getElementById('side-item-'+azimuth_item_index).style.display = '';
						document.getElementById('circularS'+azimuth_item_index).style.display = '';
						if (degree > 180){ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)'; }
						else{ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)'; }
					}
					else if (curr_azimuth > 67.5 && curr_azimuth < 112.5){
						document.getElementById('side-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularS'+azimuth_item_index).style.display = 'none';
					}
					else if (curr_azimuth > 157.5 && curr_azimuth < 202.5){ 
						document.getElementById('front-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularF'+azimuth_item_index).style.display = 'none';

						document.getElementById('side-item-'+azimuth_item_index).style.display = '';
						document.getElementById('circularS'+azimuth_item_index).style.display = '';
						if (degree < 180){ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)'; }
						else{ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)'; }
					}
					else if (curr_azimuth > 247.5 && curr_azimuth < 292.5){
						document.getElementById('side-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularS'+azimuth_item_index).style.display = 'none';
					}
					else{
						document.getElementById('side-item-'+azimuth_item_index).style.display = '';
						document.getElementById('circularS'+azimuth_item_index).style.display = '';
						if (curr_azimuth > 270 || curr_azimuth < 90){
							if (degree < 180){ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)'; }
							else{ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)';  }
						}
						else if (curr_azimuth < 270 && curr_azimuth > 90){
							if (degree > 180){ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)';  }
							else{ document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)';  }
						}
					}

				}
				
				if ( document.getElementById('side-item-'+azimuth_item_index).style.display != 'none' ){
					original_side = parseInt(document.getElementById('circularS'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));
					if ( ((curr_azimuth < 90 || curr_azimuth > 270) && (original_side > 180)) || ((curr_azimuth > 90 && curr_azimuth < 270) && (original_side < 180)) ) {
						window.alert("The annotation for the horizontal location is inconsistent with the annotation for the vertical location");
						document.querySelector('body').style.cursor = 'default'; 
						key_perform = false;
						enable_head = false;

						// prevent undesired events
						document.onclick = null;
						document.onkeydown = null;
						return;
					}

					degree = parseInt(document.getElementById('circularS'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));

					if ( ((curr_azimuth > 270 || curr_azimuth < 90) && degree>180) || ((curr_azimuth < 270 && curr_azimuth > 90) && degree<180) ){
							document.getElementById('circularS'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)'; 
					}

					if (curr_azimuth < 22.5 || curr_azimuth > 337.5){
						document.getElementById('front-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularF'+azimuth_item_index).style.display = 'none';
					}
					else if (curr_azimuth > 67.5 && curr_azimuth < 112.5){
						document.getElementById('side-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularS'+azimuth_item_index).style.display = 'none';

						document.getElementById('front-item-'+azimuth_item_index).style.display = '';
						document.getElementById('circularF'+azimuth_item_index).style.display = '';
						if (degree > 180){ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)'; }
						else{ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)'; }
					}
					else if (curr_azimuth > 157.5 && curr_azimuth < 202.5){ 
						document.getElementById('front-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularF'+azimuth_item_index).style.display = 'none';
					}
					else if (curr_azimuth > 247.5 && curr_azimuth < 292.5){
						document.getElementById('side-item-'+azimuth_item_index).style.display = 'none';
						document.getElementById('circularS'+azimuth_item_index).style.display = 'none';

						document.getElementById('front-item-'+azimuth_item_index).style.display = '';
						document.getElementById('circularF'+azimuth_item_index).style.display = '';
						if (degree < 180){ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)'; }
						else{ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)'; }
					}
					else{
						document.getElementById('front-item-'+azimuth_item_index).style.display = '';
						document.getElementById('circularF'+azimuth_item_index).style.display = '';
						if (curr_azimuth < 180){
							if (degree > 180){ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)'; }
							else{ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)';  }
						}
						else if (curr_azimuth > 180){
							if (degree < 180){ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+(360-degree)+'deg)';  }
							else{ document.getElementById('circularF'+azimuth_item_index).style.transform = 'rotate('+degree+'deg)'; }
						}
					}
				}

				azimuth[azimuth_item_index - 1] = curr_azimuth;
				document.getElementById('circular'+azimuth_item_index).setAttribute('style','');
				document.getElementById('circular'+azimuth_item_index).style.transform = 'rotate('+curr_azimuth+'deg)';
				document.getElementById('head-item-'+azimuth_item_index).setAttribute('style','');
				changeSize(azimuth_item_index); 
				displayBall(curr_azimuth - 180, (elevation[azimuth_item_index-1] != undefined ? elevation[azimuth_item_index-1] : 0) , azimuth_item_index); // display 3D azimuth

				document.getElementById('p-azimuth').innerHTML = curr_azimuth + " degrees";
				document.getElementById('p-elevation').innerHTML = (elevation[azimuth_item_index-1] != undefined ? elevation[azimuth_item_index-1] : 0) + " degrees";

				current_colors_index = azimuth_item_index-1;
				color_hex = '000000'+colors[azimuth_item_index-1].toString(16);
				document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
				document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);

				if (elevation[azimuth_item_index-1] != null) find_gaussian([azimuth[azimuth_item_index-1], elevation[azimuth_item_index-1]], Number.MAX_VALUE, -1);

				key_perform = false;
				enable_head = false;

				// prevent undesired events
				document.onclick = null;
				document.onkeydown = null;

				value = (curr_azimuth == 360 ? 0 : curr_azimuth);
				timestamp = Date.now();
				action_type = 'azimuth';
				ajax_interaction();
			}
			else if (enable_front){
				if ( elevation_item_index == -1 ){
					window.alert("You have already annotated " + source_count + " vertical locations. Please update the number of distinct sounds before continuing."); 
					document.querySelector('body').style.cursor = 'default'; 
					key_perform = false;
					enable_front = false;

					// prevent undesired events
					document.onclick = null;
					document.onkeydown = null;
					return;
				}

				if ((elevation_item_index > azimuth_item_index) && azimuth_item_index != -1) {
					window.alert("You must annotate a horizontal location before adding a new sound annotation"); 
					document.querySelector('body').style.cursor = 'default'; 
					key_perform = false;
					enable_front = false;

					// prevent undesired events
					document.onclick = null;
					document.onkeydown = null;
					return;
				}

				elevation_item_index += 1;
				temp_azimuth = calculateAzimuth(e.pageX, e.pageY, front_cx, front_cy);

				if (azimuth[elevation_item_index-1] != undefined){

					if (azimuth[elevation_item_index-1] > 180 && temp_azimuth < 180){ temp_azimuth = 360 - temp_azimuth; }
					else if (azimuth[elevation_item_index-1] < 180 && temp_azimuth > 180){ temp_azimuth = 360 - temp_azimuth; }

					if (azimuth[elevation_item_index-1] >= 22.5 && azimuth[elevation_item_index-1] <= 67.5) {
						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
					}
					else if (azimuth[elevation_item_index-1] >= 112.5 && azimuth[elevation_item_index-1] <= 157.5) {
						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
					}
					else if (azimuth[elevation_item_index-1] >= 202.5 && azimuth[elevation_item_index-1] <= 247.5) {
						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
					}
					else if (azimuth[elevation_item_index-1] >= 292.5 && azimuth[elevation_item_index-1] <= 337.5) {
						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
					}
					else{
						if (azimuth[elevation_item_index-1] > 157.5 && azimuth[elevation_item_index-1] <= 180){
							document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
							document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
						}
						else if (azimuth[elevation_item_index-1] < 202.5 && azimuth[elevation_item_index-1] > 180){
							document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
							document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
						}
						else if (azimuth[elevation_item_index-1] > 337.5){
							document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
							document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
						}
						else if (azimuth[elevation_item_index-1] < 22.5){
							document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
							document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
						}
						else{
							document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
							document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
						}
					}
				}
				else{
					document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
					document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
					document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
				}

				// calculate the displayed elevation
				if (temp_azimuth <= 180){ curr_elevation = 90 - temp_azimuth; }
				else{ curr_elevation = (temp_azimuth - 180) - 90 }
				
				elevation[elevation_item_index-1] = curr_elevation;
				temp_azimuth = azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] - 180 : -180;
				changeSize(elevation_item_index); 
				displayBall(temp_azimuth, curr_elevation, elevation_item_index);

				// display azimuth and elevation
				document.getElementById('p-azimuth').innerHTML = (azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] : 0) + " degrees";
				document.getElementById('p-elevation').innerHTML = curr_elevation + " degrees";

				// color display
				current_colors_index = elevation_item_index-1;
				color_hex = '000000'+colors[elevation_item_index-1].toString(16);
				document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
				document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);

				if (azimuth[elevation_item_index-1] != null) find_gaussian([azimuth[elevation_item_index-1], elevation[elevation_item_index-1]], Number.MAX_VALUE, -1);

				enable_front = false; 

				key_perform = false;
				enable_front = false;

				// prevent undesired events
				document.onclick = null;
				document.onkeydown = null;

				value = curr_elevation
				timestamp = Date.now();
				action_type = 'elevation'
				ajax_interaction();
			}
			else if (enable_side){
				if (elevation_item_index == -1){
					window.alert("You have already annotated " + source_count + " vertical locations. Please update the number of distinct sounds before continuing."); 
					document.querySelector('body').style.cursor = 'default';
					key_perform = false;
					enable_side = false;

					// prevent undesired events
					document.onclick = null;
					document.onkeydown = null;
					return;
				}

				if ((elevation_item_index > azimuth_item_index) && azimuth_item_index != -1) {
					window.alert("You must annotate a horizontal location before adding a new sound annotation"); 
					document.querySelector('body').style.cursor = 'default'; 
					key_perform = false;
					enable_side = false;

					// prevent undesired events
					document.onclick = null;
					document.onkeydown = null;
					return;
				}

				elevation_item_index += 1;
				temp_azimuth = calculateAzimuth(e.pageX, e.pageY, side_cx, side_cy);

				if (azimuth[elevation_item_index-1] != undefined){

					if (azimuth[elevation_item_index-1] < 90 || azimuth[elevation_item_index-1] > 270){ if (temp_azimuth > 180){ temp_azimuth = 360 - temp_azimuth; } }
					else if (azimuth[elevation_item_index-1] > 90 && azimuth[elevation_item_index-1]< 270){ if (temp_azimuth < 180){ temp_azimuth = 360 - temp_azimuth; } }
					
					if (azimuth[elevation_item_index-1] >= 22.5 && azimuth[elevation_item_index-1] <= 67.5) {
						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
					}
					else if (azimuth[elevation_item_index-1] >= 112.5 && azimuth[elevation_item_index-1] <= 157.5) {
						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
					}
					else if (azimuth[elevation_item_index-1] >= 202.5 && azimuth[elevation_item_index-1] <= 247.5) {
						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
					}
					else if (azimuth[elevation_item_index-1] >= 292.5 && azimuth[elevation_item_index-1] <= 337.5) {
						document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
						document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');

						document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
						document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
						document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
					}
					else{
						if (azimuth[elevation_item_index-1] > 67.5 && azimuth[elevation_item_index-1] <= 90){
							document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
							document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
						}
						else if (azimuth[elevation_item_index-1] > 90 && azimuth[elevation_item_index-1] < 112.5){
							document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
							document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
						}
						else if (azimuth[elevation_item_index-1] > 257.5 && azimuth[elevation_item_index-1] <= 270){
							document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
							document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
						}
						else if (azimuth[elevation_item_index-1] > 270 && azimuth[elevation_item_index-1] < 292.5){
							document.getElementById('circularF'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularF'+elevation_item_index).style.transform = 'rotate('+(360-temp_azimuth)+'deg)';
							document.getElementById('front-item-'+elevation_item_index).setAttribute('style','');
						}
						else{
							document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
							document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
							document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
						}
					}
				}
				else{
					document.getElementById('circularS'+elevation_item_index).setAttribute('style','');
					document.getElementById('circularS'+elevation_item_index).style.transform = 'rotate('+temp_azimuth+'deg)';
					document.getElementById('side-item-'+elevation_item_index).setAttribute('style','');
				}

				// calculate the displayed elevation
				if (temp_azimuth <= 180){ curr_elevation = 90 - temp_azimuth; }
				else{ curr_elevation = (temp_azimuth - 180) - 90 }

				elevation[elevation_item_index-1] = curr_elevation;
				temp_azimuth = azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] - 180 : -180;
				changeSize(elevation_item_index); 
				displayBall(temp_azimuth, curr_elevation, elevation_item_index);

				// display azimuth and elevation
				document.getElementById('p-azimuth').innerHTML = (azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] : 0) + " degrees";
				document.getElementById('p-elevation').innerHTML = curr_elevation + " degrees";

				// color display
				current_colors_index = elevation_item_index-1;
				color_hex = '000000'+colors[elevation_item_index-1].toString(16);
				document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
				document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);

				if (azimuth[elevation_item_index-1] != null) find_gaussian([azimuth[elevation_item_index-1], elevation[elevation_item_index-1]], Number.MAX_VALUE, -1);

				enable_side = false;

				// prevent undesired events
				document.onclick = null;
				document.onkeydown = null;

				value = curr_elevation
				timestamp = Date.now();
				action_type = 'elevation'
				ajax_interaction();
			}

			key_perform = false;

		}, {once:true});
	}
	return;
}

/*
Finds the smallest index for storing azimuth or elevation in the "azimuth" or "elevation" array
*/
function findDefinedAnnotation(flag){
	let index = 0
	let store_index = -1;
	while (index < azimuth.length || index < elevation.length){
		if (index > flag-1){
			if (elevation[index] != undefined || azimuth[index] != undefined){
				store_index = index;
				return store_index;
			}
		}
		else{
			if (elevation[index] != undefined || azimuth[index] != undefined) store_index = index;
			if ((index == flag-1) && store_index != -1) return store_index;
		}
		index += 1;
	}
	return (store_index == -1 ? -1 : store_index);
}

/*
The below event listeners are triggered when the annotation dot is clicked or dragged
If the dot is clicked when a deletion event is triggered, that dot will be deleted
If the dot is clicked when no event is triggered, its information will be displayed
If the dot is dragged, it will move according to the track of the mouse
*/
document.getElementById('head-item-1').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[0] = undefined;
		elevation[0] = undefined;
		changeSize(1);

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		document.getElementById('circular1').style.display = 'none';
		document.getElementById('circularF1').style.display = 'none';
		document.getElementById('circularS1').style.display = 'none';

		key_perform = true;
		let annotation = findDefinedAnnotation(1);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = 0;
		deleteBall(1);

		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[0] == undefined ? 0 : azimuth[0]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[0] == undefined ? 0 : elevation[0]) + ' degrees';
		color_hex = '000000'+colors[0].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 0;

		suppress = false;
		dragElement(1,0,0);
	}
});
document.getElementById('head-item-2').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[1] = undefined;
		elevation[1] = undefined;
		changeSize(2);

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		document.getElementById('circular2').style.display = 'none';
		document.getElementById('circularF2').style.display = 'none';
		document.getElementById('circularS2').style.display = 'none';
		key_perform = true;
		let annotation = findDefinedAnnotation(2);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(2);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[1] == undefined ? 0 : azimuth[1]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[1] == undefined ? 0 : elevation[1]) + ' degrees';
		color_hex = '000000'+colors[1].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 1;

		suppress = false;
		dragElement(2,0,1);
	}
});
document.getElementById('head-item-3').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[2] = undefined;
		elevation[2] = undefined;
		changeSize(3);

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		document.getElementById('circular3').style.display = 'none';
		document.getElementById('circularF3').style.display = 'none';
		document.getElementById('circularS3').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(3);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(3);

		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[2] == undefined ? 0 : azimuth[2]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[2] == undefined ? 0 : elevation[2]) + ' degrees';
		color_hex = '000000'+colors[2].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 2;
		suppress = false
		dragElement(3,0,2);
	}
});
document.getElementById('head-item-4').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[3] = undefined;
		elevation[3] = undefined;
		changeSize(4);

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		document.getElementById('circular4').style.display = 'none';
		document.getElementById('circularF4').style.display = 'none';
		document.getElementById('circularS4').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(4);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(4);

		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[3] == undefined ? 0 : azimuth[3]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[3] == undefined ? 0 : elevation[3]) + ' degrees';
		color_hex = '000000'+colors[3].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 3;
		suppress = false;
		dragElement(4,0,3);
	}
});
document.getElementById('head-item-5').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[4] = undefined;
		elevation[4] = undefined;
		changeSize(5);

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		document.getElementById('circular5').style.display = 'none';
		document.getElementById('circularF5').style.display = 'none';
		document.getElementById('circularS5').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(5);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(5);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[4] == undefined ? 0 : azimuth[4]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[4] == undefined ? 0 : elevation[4]) + ' degrees';
		color_hex = '000000'+colors[4].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 4;
		suppress = false;
		dragElement(5,0,4);
	}
});
document.getElementById('head-item-6').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[5] = undefined;
		elevation[5] = undefined;
		changeSize(6);

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		document.getElementById('circular6').style.display = 'none';
		document.getElementById('circularF6').style.display = 'none';
		document.getElementById('circularS6').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(6);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(6);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[5] == undefined ? 0 : azimuth[5]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[5] == undefined ? 0 : elevation[5]) + ' degrees';
		color_hex = '000000'+colors[5].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 5;
		suppress = false
		dragElement(6,0,5);
	}
});
document.getElementById('head-item-7').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[6] = undefined;
		elevation[6] = undefined;
		changeSize(7);

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		document.getElementById('circular7').style.display = 'none';
		document.getElementById('circularF7').style.display = 'none';
		document.getElementById('circularS7').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(7);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(7);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[6] == undefined ? 0 : azimuth[6]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[6] == undefined ? 0 : elevation[6]) + ' degrees';
		color_hex = '000000'+colors[6].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 6;
		suppress = false;
		dragElement(7,0,6);
	}
});
document.getElementById('head-item-8').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[7] = undefined;
		elevation[7] = undefined;
		changeSize(8);

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		document.getElementById('circular8').style.display = 'none';
		document.getElementById('circularF8').style.display = 'none';
		document.getElementById('circularS8').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(8);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(8);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[7] == undefined ? 0 : azimuth[7]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[7] == undefined ? 0 : elevation[7]) + ' degrees';
		color_hex = '000000'+colors[7].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 7;
		suppress = false;
		dragElement(8,0,7);
	}
});
document.getElementById('head-item-9').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[8] = undefined;
		elevation[8] = undefined;
		changeSize(9);

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		document.getElementById('circular9').style.display = 'none';
		document.getElementById('circularF9').style.display = 'none';
		document.getElementById('circularS9').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(9);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(9);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[8] == undefined ? 0 : azimuth[8]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[8] == undefined ? 0 : elevation[8]) + ' degrees';
		color_hex = '000000'+colors[8].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 8;
		suppress = false;
		dragElement(9,0,8);
	}
});
document.getElementById('head-item-10').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[9] = undefined;
		elevation[9] = undefined;
		changeSize(10);

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		document.getElementById('circular10').style.display = 'none';
		document.getElementById('circularF10').style.display = 'none';
		document.getElementById('circularS10').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(10);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(10);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[9] == undefined ? 0 : azimuth[9]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[9] == undefined ? 0 : elevation[9]) + ' degrees';
		color_hex = '000000'+colors[9].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 9;
		suppress = false;
		dragElement(10,0,9);
	}
});
document.getElementById('front-item-1').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[0] = undefined;
		elevation[0] = undefined;
		changeSize(1);

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		document.getElementById('circular1').style.display = 'none';
		document.getElementById('circularF1').style.display = 'none';
		document.getElementById('circularS1').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(1);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]))+ ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]))+ ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = 0;
		deleteBall(1);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[0] == undefined ? 0 : azimuth[0]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[0] == undefined ? 0 : elevation[0]) + ' degrees';
		color_hex = '000000'+colors[0].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 0;
		suppress = false;
		dragElement(1,1,0);
	}
});
document.getElementById('front-item-2').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[1] = undefined;
		elevation[1] = undefined;
		changeSize(2);

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		document.getElementById('circular2').style.display = 'none';
		document.getElementById('circularF2').style.display = 'none';
		document.getElementById('circularS2').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(2);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(2);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[1] == undefined ? 0 : azimuth[1]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[1] == undefined ? 0 : elevation[1]) + ' degrees';
		color_hex = '000000'+colors[1].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 1;
		suppress = false;
		dragElement(2,1,1);
	}
});
document.getElementById('front-item-3').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[2] = undefined;
		elevation[2] = undefined;
		changeSize(3);

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		document.getElementById('circular3').style.display = 'none';
		document.getElementById('circularF3').style.display = 'none';
		document.getElementById('circularS3').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(3);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(3);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[2] == undefined ? 0 : azimuth[2]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[2] == undefined ? 0 : elevation[2]) + ' degrees';
		color_hex = '000000'+colors[2].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 2;
		suppress = false;
		dragElement(3,1,2);
	}
});
document.getElementById('front-item-4').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[3] = undefined;
		elevation[3] = undefined;
		changeSize(4);

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		document.getElementById('circular4').style.display = 'none';
		document.getElementById('circularF4').style.display = 'none';
		document.getElementById('circularS4').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(4);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(4);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[3] == undefined ? 0 : azimuth[3]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[3] == undefined ? 0 : elevation[3]) + ' degrees';
		color_hex = '000000'+colors[3].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 3;
		suppress = false;
		dragElement(4,1,3);
	}
});
document.getElementById('front-item-5').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[4] = undefined;
		elevation[4] = undefined;
		changeSize(5);

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		document.getElementById('circular5').style.display = 'none';
		document.getElementById('circularF5').style.display = 'none';
		document.getElementById('circularS5').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(5);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(5);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[4] == undefined ? 0 : azimuth[4]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[4] == undefined ? 0 : elevation[4]) + ' degrees';
		color_hex = '000000'+colors[4].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 4;
		suppress = false;
		dragElement(5,1,4);
	}
});
document.getElementById('front-item-6').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[5] = undefined;
		elevation[5] = undefined;
		changeSize(6);

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		document.getElementById('circular6').style.display = 'none';
		document.getElementById('circularF6').style.display = 'none';
		document.getElementById('circularS6').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(6);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(6);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[5] == undefined ? 0 : azimuth[5]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[5] == undefined ? 0 : elevation[5]) + ' degrees';
		color_hex = '000000'+colors[5].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 5;
		suppress = false;
		dragElement(6,1,5);
	}
});
document.getElementById('front-item-7').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[6] = undefined;
		elevation[6] = undefined;
		changeSize(7);

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		document.getElementById('circular7').style.display = 'none';
		document.getElementById('circularF7').style.display = 'none';
		document.getElementById('circularS7').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(7);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(7);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[6] == undefined ? 0 : azimuth[6]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[6] == undefined ? 0 : elevation[6]) + ' degrees';
		color_hex = '000000'+colors[6].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 6;
		suppress = false;
		dragElement(7,1,6);
	}
});
document.getElementById('front-item-8').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[7] = undefined;
		elevation[7] = undefined;
		changeSize(8);

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		document.getElementById('circular8').style.display = 'none';
		document.getElementById('circularF8').style.display = 'none';
		document.getElementById('circularS8').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(8);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(8);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[7] == undefined ? 0 : azimuth[7]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[7] == undefined ? 0 : elevation[7]) + ' degrees';
		color_hex = '000000'+colors[7].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 7;
		suppress = false;
		dragElement(8,1,7);
	}
});
document.getElementById('front-item-9').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[8] = undefined;
		elevation[8] = undefined;
		changeSize(9);

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		document.getElementById('circular9').style.display = 'none';
		document.getElementById('circularF9').style.display = 'none';
		document.getElementById('circularS9').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(9);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(9);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[8] == undefined ? 0 : azimuth[8]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[8] == undefined ? 0 : elevation[8]) + ' degrees';
		color_hex = '000000'+colors[8].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 8;
		suppress = false;
		dragElement(9,1,8);
	}
});
document.getElementById('front-item-10').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[9] = undefined;
		elevation[9] = undefined;
		changeSize(10);

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		document.getElementById('circular10').style.display = 'none';
		document.getElementById('circularF10').style.display = 'none';
		document.getElementById('circularS10').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(10);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(10);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[9] == undefined ? 0 : azimuth[9]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[9] == undefined ? 0 : elevation[9]) + ' degrees';
		color_hex = '000000'+colors[9].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 9;
		suppress = false;
		dragElement(10,1,9);
	}
});

document.getElementById('side-item-1').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[0] = undefined;
		elevation[0] = undefined;
		changeSize(1);

		document.getElementById('head-item-1').style.display = 'none';
		document.getElementById('front-item-1').style.display = 'none';
		document.getElementById('side-item-1').style.display = 'none';
		document.getElementById('circular1').style.display = 'none';
		document.getElementById('circularF1').style.display = 'none';
		document.getElementById('circularS1').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(1);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = 0;
		deleteBall(1);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[0] == undefined ? 0 : azimuth[0]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[0] == undefined ? 0 : elevation[0]) + ' degrees';
		color_hex = '000000'+colors[0].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 0;
		suppress = false;
		dragElement(1,2,0);
	}
});
document.getElementById('side-item-2').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[1] = undefined;
		elevation[1] = undefined;
		changeSize(2);

		document.getElementById('head-item-2').style.display = 'none';
		document.getElementById('front-item-2').style.display = 'none';
		document.getElementById('side-item-2').style.display = 'none';
		document.getElementById('circular2').style.display = 'none';
		document.getElementById('circularF2').style.display = 'none';
		document.getElementById('circularS2').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(2);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(2);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[1] == undefined ? 0 : azimuth[1]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[1] == undefined ? 0 : elevation[1]) + ' degrees';
		color_hex = '000000'+colors[1].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 1;
		suppress = false;
		dragElement(2,2,1);
	}
});
document.getElementById('side-item-3').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[2] = undefined;
		elevation[2] = undefined;
		changeSize(3);

		document.getElementById('head-item-3').style.display = 'none';
		document.getElementById('front-item-3').style.display = 'none';
		document.getElementById('side-item-3').style.display = 'none';
		document.getElementById('circular3').style.display = 'none';
		document.getElementById('circularF3').style.display = 'none';
		document.getElementById('circularS3').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(3);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(3);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[2] == undefined ? 0 : azimuth[2]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[2] == undefined ? 0 : elevation[2]) + ' degrees';
		color_hex = '000000'+colors[2].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 2;
		suppress = false;
		dragElement(3,2,2);
	}
});
document.getElementById('side-item-4').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[3] = undefined;
		elevation[3] = undefined;
		changeSize(4);

		document.getElementById('head-item-4').style.display = 'none';
		document.getElementById('front-item-4').style.display = 'none';
		document.getElementById('side-item-4').style.display = 'none';
		document.getElementById('circular4').style.display = 'none';
		document.getElementById('circularF4').style.display = 'none';
		document.getElementById('circularS4').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(4);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(4);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[3] == undefined ? 0 : azimuth[3]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[3] == undefined ? 0 : elevation[3]) + ' degrees';
		color_hex = '000000'+colors[3].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 3;
		suppress = false;
		dragElement(4,2,3);
	}
});
document.getElementById('side-item-5').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[4] = undefined;
		elevation[4] = undefined;
		changeSize(5);

		document.getElementById('head-item-5').style.display = 'none';
		document.getElementById('front-item-5').style.display = 'none';
		document.getElementById('side-item-5').style.display = 'none';
		document.getElementById('circular5').style.display = 'none';
		document.getElementById('circularF5').style.display = 'none';
		document.getElementById('circularS5').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(5);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(5);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[4] == undefined ? 0 : azimuth[4]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[4] == undefined ? 0 : elevation[4]) + ' degrees';
		color_hex = '000000'+colors[4].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 4;
		suppress = false;
		dragElement(5,2,4);
	}
});
document.getElementById('side-item-6').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[5] = undefined;
		elevation[5] = undefined;
		changeSize(6);

		document.getElementById('head-item-6').style.display = 'none';
		document.getElementById('front-item-6').style.display = 'none';
		document.getElementById('side-item-6').style.display = 'none';
		document.getElementById('circular6').style.display = 'none';
		document.getElementById('circularF6').style.display = 'none';
		document.getElementById('circularS6').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(6);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(6);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[5] == undefined ? 0 : azimuth[5]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[5] == undefined ? 0 : elevation[5]) + ' degrees';
		color_hex = '000000'+colors[5].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 5;
		suppress = false;
		dragElement(6,2,5);
	}
});
document.getElementById('side-item-7').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[6] = undefined;
		elevation[6] = undefined;
		changeSize(7);

		document.getElementById('head-item-7').style.display = 'none';
		document.getElementById('front-item-7').style.display = 'none';
		document.getElementById('side-item-7').style.display = 'none';
		document.getElementById('circular7').style.display = 'none';
		document.getElementById('circularF7').style.display = 'none';
		document.getElementById('circularS7').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(7);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(7);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[6] == undefined ? 0 : azimuth[6]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[6] == undefined ? 0 : elevation[6]) + ' degrees';
		color_hex = '000000'+colors[6].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 6;
		suppress = false;
		dragElement(7,2,6);
	}
});
document.getElementById('side-item-8').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[7] = undefined;
		elevation[7] = undefined;
		changeSize(8);

		document.getElementById('head-item-8').style.display = 'none';
		document.getElementById('front-item-8').style.display = 'none';
		document.getElementById('side-item-8').style.display = 'none';
		document.getElementById('circular8').style.display = 'none';
		document.getElementById('circularF8').style.display = 'none';
		document.getElementById('circularS8').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(8);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(8);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[7] == undefined ? 0 : azimuth[7]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[7] == undefined ? 0 : elevation[7]) + ' degrees';
		color_hex = '000000'+colors[7].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 7;
		suppress = false;
		dragElement(8,2,7);
	}
});
document.getElementById('side-item-9').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable

	if (delete_annotation){
		suppress = true;

		azimuth[8] = undefined;
		elevation[8] = undefined;
		changeSize(9);

		document.getElementById('head-item-9').style.display = 'none';
		document.getElementById('front-item-9').style.display = 'none';
		document.getElementById('side-item-9').style.display = 'none';
		document.getElementById('circular9').style.display = 'none';
		document.getElementById('circularF9').style.display = 'none';
		document.getElementById('circularS9').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(9);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(9);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[8] == undefined ? 0 : azimuth[8]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[8] == undefined ? 0 : elevation[8]) + ' degrees';
		color_hex = '000000'+colors[8].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 8;
		suppress = false;
		dragElement(9,2,8);
	}
});
document.getElementById('side-item-10').addEventListener("mousedown",function(e){
	e.preventDefault(); // Prevent dragging text event of the current draggable
	
	if (delete_annotation){
		suppress = true;

		azimuth[9] = undefined;
		elevation[9] = undefined;
		changeSize(10);

		document.getElementById('head-item-10').style.display = 'none';
		document.getElementById('front-item-10').style.display = 'none';
		document.getElementById('side-item-10').style.display = 'none';
		document.getElementById('circular10').style.display = 'none';
		document.getElementById('circularF10').style.display = 'none';
		document.getElementById('circularS10').style.display = 'none';
				
		key_perform = true;
		let annotation = findDefinedAnnotation(10);
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation])) + ' degrees';
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation])) + ' degrees';
		if (annotation != -1){
			color_hex = '000000'+colors[annotation].toString(16);
			document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
			document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		}
		else{
			document.getElementById('azimuth-dot').style.backgroundColor = '';
			document.getElementById('elevation-dot').style.backgroundColor = '';
		}
		key_perform = false;
		current_colors_index = annotation;
		deleteBall(10);
		
		// disable further deletion
		delete_annotation = false;
		e.ctrlKey = false;

		// prevent undesired events
		document.onmousedown = null; 
		document.onkeydown = null;
	}
	else if (document.querySelector('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[9] == undefined ? 0 : azimuth[9]) + ' degrees';
		document.getElementById('p-elevation').innerHTML = (elevation[9] == undefined ? 0 : elevation[9]) + ' degrees';
		color_hex = '000000'+colors[9].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 9;
		suppress = false;
		dragElement(10,2,9);
	}
});

/* Three.js */

container = document.getElementById('3d-head');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
var light = new THREE.HemisphereLight(0xffffff, 1);
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

const clock = new THREE.Clock()

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

function deleteBall(number){ 
	if (document.getElementById('p-azimuth').innerHTML == " degrees") {
		document.getElementById('p-azimuth').innerHTML = '';
		document.getElementById('p-elevation').innerHTML = '';
	}
	scene.remove(scene.getObjectByName('ball'+number)); 
}

function removeAllBalls(){
	var index = 0;
	while (index < 10){
		scene.remove(scene.getObjectByName('ball'+(index + 1)));
		index += 1;
	}
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
renderer.setSize(500,500);
container.appendChild(renderer.domElement);

camera.lookAt(sphere.position);

controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 500;

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