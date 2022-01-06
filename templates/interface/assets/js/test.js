totalAnnotation = 2;
recording_id = 1;

// colors
var colors = [0x009dff, 0xff7f0e, 0x00ff00, 0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];
var current_colors_index = 0;

// prevent deletion and mousemove happen at the same time
var suppress = false;

// Location
var curr_azimuth = 0;
var curr_elevation = 0;
var azimuth = new Array();
var elevation = new Array();

// Annotation
var source_count = 0;

// this is used to distinguish between adding event and determining event
var key_perform = false;

// user control of audio
var isPlaying = false;

// modal box
var modal = document.getElementById("modal");

// instruction number
var curr_instruction = 1;

// these are look up tables for annotation dots' size changing 
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

document.getElementById('source').src = '/templates/interface/assets/audio/test'+recording_id+'.wav';
document.getElementById('audio').load();
document.getElementById('body').addEventListener("mouseup",function(){ 
	document.getElementById('body').style.cursor = 'default'; 
});
document.getElementById('message').addEventListener("click",popRules);
document.getElementById('instruction-left').addEventListener("click",move_instruction_last);
document.getElementById('instruction-right').addEventListener("click",move_instruction_next);
document.getElementById("sign").addEventListener("click",closeRules);
document.getElementById('audio-frame').addEventListener("click",addPlaying);
document.getElementById('audio').addEventListener("ended",displaySelection);
document.getElementById('audio').addEventListener("timeupdate",audioTracker);
document.getElementById('count').addEventListener("change",addSourceCount);

document.getElementById('azimuth-plus').addEventListener("click",move_azimuth_plus);
document.getElementById('elevation-plus').addEventListener("click",move_elevation_plus);
document.getElementById('azimuth-minus').addEventListener("click",move_azimuth_minus);
document.getElementById('elevation-minus').addEventListener("click",move_elevation_minus);

function popRules(e){ 
	e.preventDefault();
	modal.style.display = "block";
}

function closeRules(e){ 
	e.preventDefault();
	modal.style.display = "none";
}

function move_instruction_next(e){
	e.preventDefault();
	if (curr_instruction < 6) {
		document.getElementById('instruction'+curr_instruction).style.display = 'none';
		document.getElementById('instruction'+(curr_instruction+1)).style.display = '';
		curr_instruction += 1;
	}
}

function move_instruction_last(e){
	e.preventDefault();
	if (curr_instruction > 1) {
		document.getElementById('instruction'+curr_instruction).style.display = 'none';
		document.getElementById('instruction'+(curr_instruction-1)).style.display = '';
		curr_instruction -= 1;
	}
}

function addSourceCount(){
	document.getElementById('2d-question').innerHTML = "Please identify the location of each source:";

	document.getElementById('head').setAttribute('style',"background-image: url('/templates/interface/img/head.png'); display:inline-block;");
	document.getElementById('feedback').setAttribute('style',"display:inline-block;");
	document.getElementById('front').setAttribute('style',"background-image: url('/templates/interface/img/front.png'); display: inline-block;");
	document.getElementById('side').setAttribute('style',"background-image: url('/templates/interface/img/side.png'); display: inline-block;");

	displayButton();
	source_count = document.getElementById('count').value;
}

function audioTracker(){
	let track = document.getElementById('audio').currentTime / document.getElementById('audio').duration * 100;
	document.getElementById('audio-frame').style.background = 'linear-gradient(to right, #efefef '+track+'%, #ffffff 0%)';
}

function addPlaying(e){
	e.preventDefault();
	if (!isPlaying){
		document.getElementById('audio').play();
		document.getElementById('audio-frame').innerHTML='Pause Audio';
		isPlaying = true;
	}
	else{
		isPlaying = false
		document.getElementById('audio').pause();
		document.getElementById('audio-frame').innerHTML='Play Audio';
	}
}

function displaySelection(){ 
	isPlaying = false;
	document.getElementById('audio-frame').innerHTML='Play Audio';
	document.getElementById('count').setAttribute('style','');
}

function displayButton(){
	if (recording_id < totalAnnotation) document.getElementById('btn-button-next').setAttribute('style','float:right;');
	else document.getElementById('btn-button-submit').setAttribute('style','float:right;');

    document.getElementById('btn-button-refresh').setAttribute('style','float:left;');
}

function askProceed(){
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

function setNextQuestion(){
	if (!next()) return false;

	recording_id += 1;
	document.getElementById('source').src = '/templates/interface/assets/audio/test'+recording_id+'.wav';
	document.getElementById('audio').load();
	document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";
	document.getElementById('default-option').selected = true;

	document.getElementById('2d-question').innerHTML='';
	document.getElementById('count').style.display='none';
	document.getElementById('btn-button-next').style.display='none';
	document.getElementById('btn-button-refresh').style.display='none';

	document.getElementById("feedback").style.display='none';
	document.getElementById("head").style.display='none';
	document.getElementById("front").style.display='none';
	document.getElementById("side").style.display='none';
	reloadAll();
	return true;
}

function next(){
    if (!askProceed()){
        event.preventDefault();
        return false;
    }

	azimuth = new Array();
	elevation = new Array();

	return true;
}

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
		else{
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
		else{
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

// TODO:
function changeSize(item_index){

	const selected_azimuth = azimuth[item_index - 1];
	let size = 15 - 6;
	let margin_top = -12 + 6;

	for ( let index = azimuth.length - 1; index > -1; index-- ){
		if ( selected_azimuth != undefined && selected_azimuth == azimuth[index] ) {
			if ( index != (item_index - 1) ){
				indicators[item_index][index] = true;
				indicators[index+1][item_index-1] = true;
			}

			size = size + 6;
			margin_top = margin_top - 6;
			document.getElementById('head-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';

		}
		else if ( selected_azimuth == undefined || selected_azimuth != azimuth[index] ) {
			if ( item_index == 1 && indicators[1][index] ) {
				indicators[1][index] = undefined;
				indicators[index+1][0] = undefined; 
			}
			else if ( item_index == 2 && indicators[2][index] ){
				indicators[2][index] = undefined;
				indicators[index+1][1] = undefined;

				if (index < 1){
					document.getElementById('head-item-1').style.height = (parseInt(document.getElementById('head-item-1').style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-1').style.marginTop = (parseInt(document.getElementById('head-item-1').style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 3 && indicators[3][index] ) {
				indicators[3][index] = undefined;
				indicators[index+1][2] = undefined;

				if (index < 2){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 4 && indicators[4][index] ) {
				indicators[4][index] = undefined;
				indicators[index+1][3] = undefined;

				if (index < 3){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 5 && indicators[5][index] ) {
				indicators[5][index] = undefined;
				indicators[index+1][4] = undefined;

				if (index < 4){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 6 && indicators[6][index]) {
				indicators[6][index] = undefined;
				indicators[index+1][5] = undefined;

				if (index < 5){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 7 && indicators[7][index] ) {
				indicators[7][index] = undefined;
				indicators[index+1][6] = undefined;

				if (index < 6){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 8 && indicators[8][index] ) {
				indicators[8][index] = undefined;
				indicators[index+1][7] = undefined;

				if (index < 7){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 9 && indicators[9][index] ) {
				indicators[9][index] = undefined;
				indicators[index+1][8] = undefined;

				if (index < 8){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 10 && indicators[10][index] )  {
				indicators[10][index] = undefined;
				indicators[index+1][9] = undefined;

				if (index < 9){
					document.getElementById('head-item-'+(index + 1)).style.height = (parseInt(document.getElementById('head-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('head-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('head-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
		}
	}

	const selected_elevation = elevation[item_index - 1];
	const selected_elevation_degree = parseInt(document.getElementById('circularF'+item_index).style.transform.replace('rotate(','').replace('deg)',''));
	size = 15 - 6;
	margin_top = -12 + 6;

	for ( let index = elevation.length - 1; index > -1; index-- ) {
		const current_index_degree = parseInt(document.getElementById('circularF'+(index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if ( selected_elevation != undefined && selected_elevation_degree == current_index_degree ) {

			if ( index != (item_index - 1) ){
				front_indicators[item_index][index] = true;
				front_indicators[index+1][item_index-1] = true;
			}

			size = size + 6;
			margin_top = margin_top - 6;
			document.getElementById('front-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';

		}
		else if ( selected_elevation == undefined || selected_elevation_degree != current_index_degree ) {
			if ( item_index == 1 && front_indicators[1][index] ) {
				front_indicators[1][index] = undefined;
				front_indicators[index+1][0] = undefined; 
			}
			else if ( item_index == 2 && front_indicators[2][index] ){
				front_indicators[2][index] = undefined;
				front_indicators[index+1][1] = undefined;

				if (index < 1){
					document.getElementById('front-item-1').style.height = (parseInt(document.getElementById('front-item-1').style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-1').style.marginTop = (parseInt(document.getElementById('front-item-1').style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 3 && front_indicators[3][index] ) {
				front_indicators[3][index] = undefined;
				front_indicators[index+1][2] = undefined;

				if (index < 2){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 4 && front_indicators[4][index] ) {
				front_indicators[4][index] = undefined;
				front_indicators[index+1][3] = undefined;

				if (index < 3){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 5 && front_indicators[5][index] ) {
				front_indicators[5][index] = undefined;
				front_indicators[index+1][4] = undefined;

				if (index < 4){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 6 && front_indicators[6][index]) {
				front_indicators[6][index] = undefined;
				front_indicators[index+1][5] = undefined;

				if (index < 5){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 7 && front_indicators[7][index] ) {
				front_indicators[7][index] = undefined;
				front_indicators[index+1][6] = undefined;

				if (index < 6){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 8 && front_indicators[8][index] ) {
				front_indicators[8][index] = undefined;
				front_indicators[index+1][7] = undefined;

				if (index < 7){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 9 && front_indicators[9][index] ) {
				front_indicators[9][index] = undefined;
				front_indicators[index+1][8] = undefined;

				if (index < 8){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 10 && front_indicators[10][index] )  {
				front_indicators[10][index] = undefined;
				front_indicators[index+1][9] = undefined;

				if (index < 9){
					document.getElementById('front-item-'+(index + 1)).style.height = (parseInt(document.getElementById('front-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('front-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('front-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
		}
	}

	const selected_elevation2 = elevation[item_index - 1];
	const selected_elevation_degree2 = parseInt(document.getElementById('circularS'+item_index).style.transform.replace('rotate(','').replace('deg)',''));
	size = 15 - 6;
	margin_top = -12 + 6;

	for ( let index = elevation.length - 1; index > -1; index-- ) {
		const current_index_degree2 = parseInt(document.getElementById('circularS'+(index+1)).style.transform.replace('rotate(','').replace('deg)',''));

		if ( selected_elevation2 != undefined && selected_elevation_degree2 == current_index_degree2 ) {

			if ( index != (item_index - 1) ){
				side_indicators[item_index][index] = true;
				side_indicators[index+1][item_index-1] = true;
			}

			size = size + 6;
			margin_top = margin_top - 6;
			document.getElementById('side-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';

		}
		else if ( selected_elevation2 == undefined || selected_elevation_degree2 != current_index_degree2 ) {
			if ( item_index == 1 && side_indicators[1][index] ) {
				side_indicators[1][index] = undefined;
				side_indicators[index+1][0] = undefined; 
			}
			else if ( item_index == 2 && side_indicators[2][index] ){
				side_indicators[2][index] = undefined;
				side_indicators[index+1][1] = undefined;

				if (index < 1){
					document.getElementById('side-item-1').style.height = (parseInt(document.getElementById('side-item-1').style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-1').style.marginTop = (parseInt(document.getElementById('side-item-1').style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 3 && side_indicators[3][index] ) {
				side_indicators[3][index] = undefined;
				side_indicators[index+1][2] = undefined;

				if (index < 2){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 4 && side_indicators[4][index] ) {
				side_indicators[4][index] = undefined;
				side_indicators[index+1][3] = undefined;

				if (index < 3){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 5 && side_indicators[5][index] ) {
				side_indicators[5][index] = undefined;
				side_indicators[index+1][4] = undefined;

				if (index < 4){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 6 && side_indicators[6][index]) {
				side_indicators[6][index] = undefined;
				side_indicators[index+1][5] = undefined;

				if (index < 5){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 7 && side_indicators[7][index] ) {
				side_indicators[7][index] = undefined;
				side_indicators[index+1][6] = undefined;

				if (index < 6){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 8 && side_indicators[8][index] ) {
				side_indicators[8][index] = undefined;
				side_indicators[index+1][7] = undefined;

				if (index < 7){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 9 && side_indicators[9][index] ) {
				side_indicators[9][index] = undefined;
				side_indicators[index+1][8] = undefined;

				if (index < 8){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
			else if ( item_index == 10 && side_indicators[10][index] )  {
				side_indicators[10][index] = undefined;
				side_indicators[index+1][9] = undefined;

				if (index < 9){
					document.getElementById('side-item-'+(index + 1)).style.height = (parseInt(document.getElementById('side-item-'+(index + 1)).style.height.replace('px','')) - 6).toString() + 'px';
					document.getElementById('side-item-'+(index + 1)).style.marginTop = (parseInt(document.getElementById('side-item-'+(index + 1)).style.marginTop.replace('px','')) + 6).toString() + 'px';
				}
			}
		}
	}
}

function move_azimuth_plus(e){
	e.preventDefault();

	if (document.getElementById('head-item-'+(current_colors_index+1)).style.display == 'none'){ 
		window.alert("Please select an annotation");
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
	document.getElementById('p-azimuth').innerHTML = temp_azimuth;
	azimuth[current_colors_index] = temp_azimuth;
	document.getElementById('circular'+(current_colors_index+1)).style.transform = 'rotate('+temp_azimuth+'deg)';

	changeSize(current_colors_index+1);

	current_elevation = (elevation[current_colors_index] == undefined ? 0 : elevation[current_colors_index]);
	displayBall((azimuth[current_colors_index]-180), current_elevation, (current_colors_index+1));
}

function move_azimuth_minus(e){
	e.preventDefault();

	if (document.getElementById('head-item-'+(current_colors_index+1)).style.display == 'none'){ 
		window.alert("Please select an annotation"); 
		return false; 
	}

	temp_azimuth = parseInt(document.getElementById('p-azimuth').innerHTML) - 1;
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

	document.getElementById('p-azimuth').innerHTML = temp_azimuth;
	azimuth[current_colors_index] = temp_azimuth;
	document.getElementById('circular'+(current_colors_index+1)).style.transform = 'rotate('+temp_azimuth+'deg)';

	changeSize(current_colors_index+1);

	current_elevation = (elevation[current_colors_index] == undefined ? 0 : elevation[current_colors_index]);
	displayBall((azimuth[current_colors_index]-180), current_elevation, (current_colors_index+1));
}

function move_elevation_plus(e){
	e.preventDefault();

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display == 'none' 
	&& document.getElementById('side-item-'+(current_colors_index+1)).style.display == 'none' ){
		window.alert("Please select an annotation"); 
		return false; 
	}

	new_elevation = parseInt(document.getElementById('p-elevation').innerHTML) + 1;
	if (new_elevation > 90) { return false; }

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display != 'none'){
		document.getElementById('p-elevation').innerHTML = new_elevation;
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
		document.getElementById('p-elevation').innerHTML = new_elevation;
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
}

function move_elevation_minus(e){
	e.preventDefault();
	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display == 'none' && document.getElementById('side-item-'+(current_colors_index+1)).style.display == 'none' ){ 
		window.alert("Please select an annotation"); 
		return false; 
	}

	new_elevation = parseInt(document.getElementById('p-elevation').innerHTML) - 1;
	if (new_elevation < (-90)) { return false; }

	if (document.getElementById('front-item-'+(current_colors_index+1)).style.display != 'none'){
		degree = parseInt(document.getElementById('circular'+(current_colors_index+1)).style.transform.replace('rotate(','').replace('deg)',''));
		document.getElementById('p-elevation').innerHTML = new_elevation;
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
		document.getElementById('p-elevation').innerHTML = new_elevation;
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
}

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
		if (suppress) return;

		document.onmousemove = mouse;
		document.onmouseup = function(e){
			if (suppress) return; 
			e.preventDefault();
			suppress = true;

			temp_azimuthS = parseInt(document.getElementById('circularS'+index).style.transform.replace('rotate(','').replace('deg)',''));

			if (document.getElementById('head-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circular'+index).style.transform.replace('rotate(','').replace('deg)',''));

				if ( ((degree < 90 || degree > 270) && (temp_azimuthS > 180)) || ((degree > 90 && degree < 270) && (temp_azimuthS < 180)) ){
					window.alert("Your side view annotation does not match with your azimuth");
					itemS.style.transform = 'rotate('+original_side_degree+'deg)';
					document.onmouseup = null; 
					document.onmousemove = null;
					document.getElementById('p-elevation').innerHTML = elevation[add_index];
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

			document.onmouseup = null; 
			document.onmousemove = null;
		}
	}

	itemF.onmousedown = function(){
		if (suppress) return;

		document.onmousemove = mouse;
		document.onmouseup = function(e){
			if (suppress) return; 
			e.preventDefault();
			suppress = true;

			temp_azimuthF = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));

			if (document.getElementById('head-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circular'+index).style.transform.replace('rotate(','').replace('deg)',''));

				if ( (degree < 180 && temp_azimuthF > 180) || (degree > 180 && temp_azimuthF < 180) ){
					window.alert("Your back view annotation does not match with your azimuth");
					itemF.style.transform = 'rotate('+original_front_degree+'deg)';
					document.onmouseup = null; 
					document.onmousemove = null;
					document.getElementById('p-elevation').innerHTML = elevation[add_index];
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

			document.onmouseup = null; 
			document.onmousemove = null;
		}
	}

	item.onmousedown = function() {
		if (suppress) return;

   		document.onmousemove = mouse;
		document.onmouseup = function(e) {
			if (suppress) return; 
			e.preventDefault();
			suppress = true;

			temp_azimuth = parseInt(document.getElementById('p-azimuth').innerHTML);

			if (document.getElementById('front-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circularF'+index).style.transform.replace('rotate(','').replace('deg)',''));

				if ((temp_azimuth < 180 && degree > 180) || (temp_azimuth > 180 && degree < 180)){ degree = 360 - degree; }
				displayBoth(true, index, temp_azimuth, degree);
			}

			if (document.getElementById('side-item-'+index).style.display != 'none'){
				degree = parseInt(document.getElementById('circularS'+index).style.transform.replace('rotate(','').replace('deg)',''));

				if ( ((temp_azimuth > 270 || temp_azimuth < 90) && degree>180)
					|| ((temp_azimuth < 270 && temp_azimuth > 90) && degree<180) ){ degree = 360 - degree; }
				displayBoth(false, index, temp_azimuth, degree);
			}

			displayBall(temp_azimuth-180, (elevation[add_index] != undefined ? elevation[add_index] : 0), index);
			curr_azimuth = temp_azimuth;
			azimuth[add_index] = curr_azimuth;

			changeSize(index);

			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	function mouse(e) {
		if (suppress) return;
		e.preventDefault();

		if (indicator == 1) {
			var ilocationF = itemF.getBoundingClientRect();
			var cxF = (ilocationF.right + ilocationF.left) / 2;
			var cyF = (ilocationF.top + ilocationF.bottom) / 2;
			var temp_azimuthF = calculateAzimuth(e.pageX, e.pageY, cxF, cyF);
			temp_azimuthF = (temp_azimuthF == 360 ? 0 : temp_azimuthF);

			if (temp_azimuthF <= 180){ curr_elevation = 90 - temp_azimuthF; }
			else{ curr_elevation = (temp_azimuthF - 180) - 90 }

			itemF.style.transform = 'rotate('+temp_azimuthF+'deg)';
			document.getElementById('p-azimuth').innerHTML = (azimuth[add_index] != undefined ? azimuth[add_index] : 0);
			document.getElementById('p-elevation').innerHTML = curr_elevation;
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
			document.getElementById('p-azimuth').innerHTML = (azimuth[add_index] != undefined ? azimuth[add_index] : 0);
			document.getElementById('p-elevation').innerHTML = curr_elevation;
		}
		else{
			var ilocation = item.getBoundingClientRect();
			var cx = (ilocation.right + ilocation.left) / 2;
			var cy = (ilocation.top + ilocation.bottom) / 2;
			var temp_azimuth = calculateAzimuth(e.pageX, e.pageY, cx, cy);
			temp_azimuth = (temp_azimuth == 360 ? 0 : temp_azimuth);

			item.style.transform = 'rotate('+temp_azimuth+'deg)';
			document.getElementById('p-azimuth').innerHTML = temp_azimuth;
			document.getElementById('p-elevation').innerHTML = (elevation[add_index] != undefined ? elevation[add_index] : 0);
		}
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

document.addEventListener("keydown", keyboardEvents);
function keyboardEvents(e){
	e.preventDefault(); // prevent any undesired keyboard event

	if (e.keyCode === 65){
		console.log("Azimuth: "+azimuth.toString());
		console.log("Elevation: "+elevation.toString());
	}
	
	if(e.metaKey){
		document.getElementById('body').style.cursor = "url('/templates/interface/img/minus.svg'), auto";

		enable_head = false; enable_front = false; enable_side = false; // no adding should be allowed
		delete_head = true; delete_front = true; delete_side = true; // deletion active

		document.onkeydown = null; // to indicate that the key was already pressed
		suppress = true; // to prevent dragging event
		return;
	}

	// set up to get location
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

	if (e.altKey){
		delete_head = false; delete_front = false; delete_side = false; // prevent deletion
		document.getElementById('body').style.cursor = 'cell';

		key_perform = true;
		var azimuth_item_index = findUndefinedAzimuth();
		var elevation_item_index = findUndefinedElevation();

		document.addEventListener('mousedown', function(e){
			enable_head = calculateRadius(e.pageX, e.pageY, head_cx, head_cy);
			enable_front = calculateRadius(e.pageX, e.pageY, front_cx, front_cy);
			enable_side = calculateRadius(e.pageX, e.pageY, side_cx, side_cy);

			if (enable_head){
				if ( azimuth_item_index == -1 ){
					window.alert("You have already enter " + source_count + " azimuth elements. CLICK ANYWHERE to exit adding."); 
					key_perform = false;
					enable_head = false;
					document.onmousedown = null; 
					document.onkeydown = null; 
					document.getElementById('body').style.cursor = 'default'; 
					return;
				}

				if ((azimuth_item_index > elevation_item_index) && elevation_item_index != -1) {
					enable_head = false;
					window.alert("You must annotate an elevation. CLICK ANYWHERE to exit adding. "); 
					key_perform = false;
					return;
				}

				azimuth_item_index += 1;
				curr_azimuth = calculateAzimuth(e.pageX, e.pageY, head_cx, head_cy);
				curr_azimuth = (curr_azimuth == 360 ? 0 : curr_azimuth);

				if ( document.getElementById('front-item-'+azimuth_item_index).style.display != 'none' ){
					original_front = parseInt(document.getElementById('circularF'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));
					if ( (original_front < 180 && curr_azimuth > 180)
					|| (original_front > 180 && curr_azimuth < 180) ) {
						window.alert("Your head view annotation does not match with your front view annotation"); 
						key_perform = false;
						document.onmousedown = null;
						document.onkeydown = null;
						document.getElementById('body').style.cursor = 'default'; 
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
				else if ( document.getElementById('side-item-'+azimuth_item_index).style.display != 'none' ){
					original_side = parseInt(document.getElementById('circularS'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));
					if ( ((curr_azimuth < 90 || curr_azimuth > 270) && (original_side > 180))
					|| ((curr_azimuth > 90 && curr_azimuth < 270) && (original_side < 180)) ) {
						window.alert("Your head view annotation does not match with your side view annotation");
						key_perform = false;
						document.onmousedown = null; 
						document.onkeydown = null;
						document.getElementById('body').style.cursor = 'default'; 
						return;
					}

					degree = parseInt(document.getElementById('circularS'+azimuth_item_index).style.transform.replace('rotate(','').replace('deg)',''));

					if ( ((curr_azimuth > 270 || curr_azimuth < 90) && degree>180)
						|| ((curr_azimuth < 270 && curr_azimuth > 90) && degree<180) ){
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

				displayBall(curr_azimuth - 180, (elevation[azimuth_item_index-1] != undefined ? elevation[azimuth_item_index-1] : 0) , azimuth_item_index);

				document.getElementById('p-azimuth').innerHTML = curr_azimuth;
				document.getElementById('p-elevation').innerHTML = (elevation[azimuth_item_index-1] != undefined ? elevation[azimuth_item_index-1] : 0);

				current_colors_index = azimuth_item_index-1;
				color_hex = '000000'+colors[azimuth_item_index-1].toString(16);
				document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
				document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);

				enable_head = false; enable_front = false; enable_side = false;

				document.onmousedown = null; 
				document.onkeydown = null;
			}
			else if (enable_front){
				if ( elevation_item_index == -1 ){
					enable_front = false;
					window.alert("You have already enter " + source_count + " elevation elements. CLICK ANYWHERE to exit adding."); 
					key_perform = false;
					document.onmousedown = null; 
					document.onkeydown = null;
					document.getElementById('body').style.cursor = 'default'; 
					return;
				}

				if ((elevation_item_index > azimuth_item_index) && azimuth_item_index != -1) {
					enable_front = false;
					window.alert("You must annotate an azimuth. CLICK ANYWHERE to exit adding."); 
					key_perform = false;
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
				document.getElementById('p-azimuth').innerHTML = (azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] : 0);
				document.getElementById('p-elevation').innerHTML = curr_elevation;

				// color display
				current_colors_index = elevation_item_index-1;
				color_hex = '000000'+colors[elevation_item_index-1].toString(16);
				document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
				document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);

				enable_head = false; enable_front = false; enable_side = false; // exit adding
				document.onmousedown = null; 
				document.onkeydown = null;
			}
			else if (enable_side){
				if (elevation_item_index == -1){
					window.alert("You have already enter " + source_count + " elevation elements. CLICK ANYWHERE to exit adding."); 
					key_perform = false;
					enable_side = false;
					document.onmousedown = null; 
					document.onkeydown = null;
					document.getElementById('body').style.cursor = 'default'; 
					return;
				}

				if ((elevation_item_index > azimuth_item_index) && azimuth_item_index != -1) {
					enable_side = false;
					window.alert("You must annotate an azimuth. CLICK ANYWHERE to exit adding."); 
					key_perform = false;
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
				document.getElementById('p-azimuth').innerHTML = (azimuth[elevation_item_index-1] != undefined ? azimuth[elevation_item_index-1] : 0);
				document.getElementById('p-elevation').innerHTML = curr_elevation;

				// color display
				current_colors_index = elevation_item_index-1;
				color_hex = '000000'+colors[elevation_item_index-1].toString(16);
				document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
				document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);

				enable_head = false; enable_front = false; enable_side = false; // exit adding
				document.onmousedown = null; 
				document.onkeydown = null;
			}
			key_perform = false;
		}, {once:true});
	}
	return;
}

function reloadAll(){
	azimuth = new Array();
	elevation = new Array();
	current_colors_index = 0;
	curr_azimuth = 0;
	curr_elevation = 0;
	indicators = {
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

	front_indicators = {
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

	side_indicators = {
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
	document.getElementById('p-azimuth').innerHTML = '';
	document.getElementById('p-elevation').innerHTML = '';
	document.getElementById('azimuth-dot').style.backgroundColor = '';
	document.getElementById('elevation-dot').style.backgroundColor = '';
	removeAllBalls();
}

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
	return (store_index == -1 ? -1 : store_index); // if there is no defined annotation then return -1
}

document.getElementById('head-item-1').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[0] == undefined ? 0 : azimuth[0]);
		document.getElementById('p-elevation').innerHTML = (elevation[0] == undefined ? 0 : elevation[0]);
		color_hex = '000000'+colors[0].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 0;
		suppress = false;
		dragElement(1,0,0);
	}
});
document.getElementById('head-item-2').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[1] == undefined ? 0 : azimuth[1]);
		document.getElementById('p-elevation').innerHTML = (elevation[1] == undefined ? 0 : elevation[1]);
		color_hex = '000000'+colors[1].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 1;
		suppress = false;
		dragElement(2,0,1);
	}
});
document.getElementById('head-item-3').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[2] == undefined ? 0 : azimuth[2]);
		document.getElementById('p-elevation').innerHTML = (elevation[2] == undefined ? 0 : elevation[2]);
		color_hex = '000000'+colors[2].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 2;
		suppress = false
		dragElement(3,0,2);
	}
});
document.getElementById('head-item-4').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML = (annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[3] == undefined ? 0 : azimuth[3]);
		document.getElementById('p-elevation').innerHTML = (elevation[3] == undefined ? 0 : elevation[3]);
		color_hex = '000000'+colors[3].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 3;
		suppress = false;
		dragElement(4,0,3);
	}
});
document.getElementById('head-item-5').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[4] == undefined ? 0 : azimuth[4]);
		document.getElementById('p-elevation').innerHTML = (elevation[4] == undefined ? 0 : elevation[4]);
		color_hex = '000000'+colors[4].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 4;
		suppress = false;
		dragElement(5,0,4);
	}
});
document.getElementById('head-item-6').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[5] == undefined ? 0 : azimuth[5]);
		document.getElementById('p-elevation').innerHTML = (elevation[5] == undefined ? 0 : elevation[5]);
		color_hex = '000000'+colors[5].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 5;
		suppress = false
		dragElement(6,0,5);
	}
});
document.getElementById('head-item-7').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[6] == undefined ? 0 : azimuth[6]);
		document.getElementById('p-elevation').innerHTML = (elevation[6] == undefined ? 0 : elevation[6]);
		color_hex = '000000'+colors[6].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 6;
		suppress = false;
		dragElement(7,0,6);
	}
});
document.getElementById('head-item-8').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[7] == undefined ? 0 : azimuth[7]);
		document.getElementById('p-elevation').innerHTML = (elevation[7] == undefined ? 0 : elevation[7]);
		color_hex = '000000'+colors[7].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 7;
		suppress = false;
		dragElement(8,0,7);
	}
});
document.getElementById('head-item-9').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[8] == undefined ? 0 : azimuth[8]);
		document.getElementById('p-elevation').innerHTML = (elevation[8] == undefined ? 0 : elevation[8]);
		color_hex = '000000'+colors[8].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 8;
		suppress = false;
		dragElement(9,0,8);
	}
});
document.getElementById('head-item-10').addEventListener("mousedown",function(e){
	if (delete_head){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[9] == undefined ? 0 : azimuth[9]);
		document.getElementById('p-elevation').innerHTML = (elevation[9] == undefined ? 0 : elevation[9]);
		color_hex = '000000'+colors[9].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 9;
		suppress = false;
		dragElement(10,0,9);
	}
});

document.getElementById('front-item-1').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[0] == undefined ? 0 : azimuth[0]);
		document.getElementById('p-elevation').innerHTML = (elevation[0] == undefined ? 0 : elevation[0]);
		color_hex = '000000'+colors[0].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 0;
		suppress = false;
		dragElement(1,1,0);
	}
});
document.getElementById('front-item-2').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[1] == undefined ? 0 : azimuth[1]);
		document.getElementById('p-elevation').innerHTML = (elevation[1] == undefined ? 0 : elevation[1]);
		color_hex = '000000'+colors[1].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 1;
		suppress = false;
		dragElement(2,1,1);
	}
});
document.getElementById('front-item-3').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[2] == undefined ? 0 : azimuth[2]);
		document.getElementById('p-elevation').innerHTML = (elevation[2] == undefined ? 0 : elevation[2]);
		color_hex = '000000'+colors[2].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 2;
		suppress = false;
		dragElement(3,1,2);
	}
});
document.getElementById('front-item-4').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[3] == undefined ? 0 : azimuth[3]);
		document.getElementById('p-elevation').innerHTML = (elevation[3] == undefined ? 0 : elevation[3]);
		color_hex = '000000'+colors[3].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 3;
		suppress = false;
		dragElement(4,1,3);
	}
});
document.getElementById('front-item-5').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[4] == undefined ? 0 : azimuth[4]);
		document.getElementById('p-elevation').innerHTML = (elevation[4] == undefined ? 0 : elevation[4]);
		color_hex = '000000'+colors[4].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 4;
		suppress = false;
		dragElement(5,1,4);
	}
});
document.getElementById('front-item-6').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[5] == undefined ? 0 : azimuth[5]);
		document.getElementById('p-elevation').innerHTML = (elevation[5] == undefined ? 0 : elevation[5]);
		color_hex = '000000'+colors[5].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 5;
		suppress = false;
		dragElement(6,1,5);
	}
});
document.getElementById('front-item-7').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[6] == undefined ? 0 : azimuth[6]);
		document.getElementById('p-elevation').innerHTML = (elevation[6] == undefined ? 0 : elevation[6]);
		color_hex = '000000'+colors[6].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 6;
		suppress = false;
		dragElement(7,1,6);
	}
});
document.getElementById('front-item-8').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[7] == undefined ? 0 : azimuth[7]);
		document.getElementById('p-elevation').innerHTML = (elevation[7] == undefined ? 0 : elevation[7]);
		color_hex = '000000'+colors[7].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 7;
		suppress = false;
		dragElement(8,1,7);
	}
});
document.getElementById('front-item-9').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[8] == undefined ? 0 : azimuth[8]);
		document.getElementById('p-elevation').innerHTML = (elevation[8] == undefined ? 0 : elevation[8]);
		color_hex = '000000'+colors[8].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 8;
		suppress = false;
		dragElement(9,1,8);
	}
});
document.getElementById('front-item-10').addEventListener("mousedown",function(e){
	if (delete_front){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[9] == undefined ? 0 : azimuth[9]);
		document.getElementById('p-elevation').innerHTML = (elevation[9] == undefined ? 0 : elevation[9]);
		color_hex = '000000'+colors[9].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 9;
		suppress = false;
		dragElement(10,1,9);
	}
});

document.getElementById('side-item-1').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[0] == undefined ? 0 : azimuth[0]);
		document.getElementById('p-elevation').innerHTML = (elevation[0] == undefined ? 0 : elevation[0]);
		color_hex = '000000'+colors[0].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 0;
		suppress = false;
		dragElement(1,2,0);
	}
});
document.getElementById('side-item-2').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[1] == undefined ? 0 : azimuth[1]);
		document.getElementById('p-elevation').innerHTML = (elevation[1] == undefined ? 0 : elevation[1]);
		color_hex = '000000'+colors[1].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 1;
		suppress = false;
		dragElement(2,2,1);
	}
});
document.getElementById('side-item-3').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[2] == undefined ? 0 : azimuth[2]);
		document.getElementById('p-elevation').innerHTML = (elevation[2] == undefined ? 0 : elevation[2]);
		color_hex = '000000'+colors[2].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 2;
		suppress = false;
		dragElement(3,2,2);
	}
});
document.getElementById('side-item-4').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[3] == undefined ? 0 : azimuth[3]);
		document.getElementById('p-elevation').innerHTML = (elevation[3] == undefined ? 0 : elevation[3]);
		color_hex = '000000'+colors[3].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 3;
		suppress = false;
		dragElement(4,2,3);
	}
});
document.getElementById('side-item-5').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[4] == undefined ? 0 : azimuth[4]);
		document.getElementById('p-elevation').innerHTML = (elevation[4] == undefined ? 0 : elevation[4]);
		color_hex = '000000'+colors[4].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 4;
		suppress = false;
		dragElement(5,2,4);
	}
});
document.getElementById('side-item-6').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[5] == undefined ? 0 : azimuth[5]);
		document.getElementById('p-elevation').innerHTML = (elevation[5] == undefined ? 0 : elevation[5]);
		color_hex = '000000'+colors[5].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 5;
		suppress = false;
		dragElement(6,2,5);
	}
});
document.getElementById('side-item-7').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[6] == undefined ? 0 : azimuth[6]);
		document.getElementById('p-elevation').innerHTML = (elevation[6] == undefined ? 0 : elevation[6]);
		color_hex = '000000'+colors[6].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 6;
		suppress = false;
		dragElement(7,2,6);
	}
});
document.getElementById('side-item-8').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[7] == undefined ? 0 : azimuth[7]);
		document.getElementById('p-elevation').innerHTML = (elevation[7] == undefined ? 0 : elevation[7]);
		color_hex = '000000'+colors[7].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 7;
		suppress = false;
		dragElement(8,2,7);
	}
});
document.getElementById('side-item-9').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[8] == undefined ? 0 : azimuth[8]);
		document.getElementById('p-elevation').innerHTML = (elevation[8] == undefined ? 0 : elevation[8]);
		color_hex = '000000'+colors[8].toString(16);
		document.getElementById('azimuth-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		document.getElementById('elevation-dot').style.backgroundColor = '#'+color_hex.substring(color_hex.length-6,color_hex.length);
		current_colors_index = 8;
		suppress = false;
		dragElement(9,2,8);
	}
});
document.getElementById('side-item-10').addEventListener("mousedown",function(e){
	if (delete_side){
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
		document.getElementById('p-azimuth').innerHTML = (annotation == -1 ? '' : (azimuth[annotation] == undefined ? 0 : azimuth[annotation]));
		document.getElementById('p-elevation').innerHTML =(annotation == -1 ? '' : (elevation[annotation] == undefined ? 0 : elevation[annotation]));
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
		delete_head = false; delete_front = false; delete_side = false; e.metaKey = false;
		document.onmousedown = null;
	}
	else if (document.getElementById('body').style.cursor == 'default') {
		document.getElementById('p-azimuth').innerHTML = (azimuth[9] == undefined ? 0 : azimuth[9]);
		document.getElementById('p-elevation').innerHTML = (elevation[9] == undefined ? 0 : elevation[9]);
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
scene.background = new THREE.Color(0xa9a9a9);
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