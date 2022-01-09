// TODO: ajax here for unconfirmed annotation audio

// this should be a list of names of audios for confirmation
const unconfirmed_annotations = [1,2];
const totalAnnotation = unconfirmed_annotations.length; 
var confirm_index = 0;

// check if there is any confirmation needed
if (totalAnnotation == 0) window.location.assign('/templates/interface/submit.html');

// TODO: ajax here for unconfirmed location

// colors
var colors = [0x009dff, 0xff7f0e, 0x00ff00, 0xff0000, 0x9467bd, 0xd3d3d3, 0xc39b77, 0xe377c2, 0xbcbd22, 0x00ffff];
var current_colors_index = 0;

// prevent deletion and mousemove happen at the same time
var suppress = false;

// Annotation
var source_count = 0;

// user control of audio
var isPlaying = undefined;

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

document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
document.getElementById('audio').load();

document.getElementById('body').addEventListener("mouseup",function(){ 
	document.getElementById('body').style.cursor = 'default'; 
});

document.getElementById('audio-frame-confirm').addEventListener("click",addPlaying);
document.getElementById('audio').addEventListener("timeupdate",audioTracker);

function audioTracker(){
	let track = document.getElementById('audio').currentTime / document.getElementById('audio').duration * 100;
	document.getElementById('audio-frame-confirm').style.background = 'linear-gradient(to right, #efefef '+track+'%, #ffffff 0%)';
}

function addPlaying(e){
	e.preventDefault();
	if (!isPlaying || isPlaying == undefined){
        isPlaying = true;
		document.getElementById('audio').play();
		document.getElementById('audio-frame-confirm').innerHTML='Pause Audio '+(confirm_index+1).toString();
	}
	else{
		isPlaying = false
		document.getElementById('audio').pause();
		document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
	}
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

function changeSize(item_index){
	const selected_azimuth = azimuth[item_index - 1];
	let size = 15 - 6;
	let margin_top = -12 + 6;

	for ( let index = azimuth.length - 1; index > -1; index-- ){
		if ( selected_azimuth != undefined && Math.abs( selected_azimuth - azimuth[index] ) <= 3) {
			if ( index != (item_index - 1) ){
				indicators[item_index][index] = true;
				indicators[index+1][item_index-1] = true;
			}

			size = size + 6;
			margin_top = margin_top - 6;
			document.getElementById('head-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('head-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';

		}
		else if ( selected_azimuth == undefined || Math.abs( selected_azimuth - azimuth[index] ) > 3 ) {
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
		const current_index_degree = document.getElementById('circularF'+(index+1)).style.display != 'none' ? parseInt(document.getElementById('circularF'+(index+1)).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation != undefined && Math.abs( selected_elevation_degree - current_index_degree ) <= 3 ) {
			if ( index != (item_index - 1) ){
				front_indicators[item_index][index] = true;
				front_indicators[index+1][item_index-1] = true;
			}

			size = size + 6;
			margin_top = margin_top - 6;
			document.getElementById('front-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('front-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';

		}
		else if ( selected_elevation == undefined || Math.abs( selected_elevation_degree - current_index_degree ) > 3 ) {
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
		const current_index_degree2 = document.getElementById('circularS'+(index+1)).style.display != 'none' ? parseInt(document.getElementById('circularS'+(index+1)).style.transform.replace('rotate(','').replace('deg)','')) : undefined ;

		if ( selected_elevation2 != undefined && Math.abs( selected_elevation_degree2 - current_index_degree2 ) <= 3 ) {
			if ( index != (item_index - 1) ){
				side_indicators[item_index][index] = true;
				side_indicators[index+1][item_index-1] = true;
			}
			size = size + 6;
			margin_top = margin_top - 6;

			document.getElementById('side-item-'+(index + 1)).style.height = size.toString() + 'px';
			document.getElementById('side-item-'+(index + 1)).style.marginTop = margin_top.toString() + 'px';

		}
		else if ( selected_elevation2 == undefined || Math.abs( selected_elevation_degree2 - current_index_degree2 ) > 3 ) {
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

document.getElementById('head-item-1').addEventListener("mousedown",function(){
    if (isPlaying == undefined) window.alert("Please play the audio first.");
    else{
        confirm_index += 1;
        if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

        document.getElementById('head-item-1').style.display = 'none';
        document.getElementById('front-item-1').style.display = 'none';
        document.getElementById('side-item-1').style.display = 'none';
        document.getElementById('circular1').style.display = 'none';
        document.getElementById('circularF1').style.display = 'none';
        document.getElementById('circularS1').style.display = 'none';
        deleteBall(1);
        document.onmousedown = null;

        document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
        document.getElementById('audio').load();
        document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
        document.getElementById('audio-frame-confirm').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";
        isPlaying = undefined;
    }
});
document.getElementById('head-item-2').addEventListener("mousedown",function(){
    if (isPlaying == undefined) window.alert("Please play the audio first.");
    else{
        confirm_index += 1;
        if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

        document.getElementById('head-item-2').style.display = 'none';
        document.getElementById('front-item-2').style.display = 'none';
        document.getElementById('side-item-2').style.display = 'none';
        document.getElementById('circular2').style.display = 'none';
        document.getElementById('circularF2').style.display = 'none';
        document.getElementById('circularS2').style.display = 'none';
        deleteBall(2);
        document.onmousedown = null;

        document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
        document.getElementById('audio').load();
        document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
        document.getElementById('audio-frame-confirm').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";
        isPlaying = undefined;
    }

});
document.getElementById('head-item-3').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-3').style.display = 'none';
    document.getElementById('front-item-3').style.display = 'none';
    document.getElementById('side-item-3').style.display = 'none';
    document.getElementById('circular3').style.display = 'none';
    document.getElementById('circularF3').style.display = 'none';
    document.getElementById('circularS3').style.display = 'none';
    deleteBall(3);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-4').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-4').style.display = 'none';
    document.getElementById('front-item-4').style.display = 'none';
    document.getElementById('side-item-4').style.display = 'none';
    document.getElementById('circular4').style.display = 'none';
    document.getElementById('circularF4').style.display = 'none';
    document.getElementById('circularS4').style.display = 'none';
    deleteBall(4);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-5').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-5').style.display = 'none';
    document.getElementById('front-item-5').style.display = 'none';
    document.getElementById('side-item-5').style.display = 'none';
    document.getElementById('circular5').style.display = 'none';
    document.getElementById('circularF5').style.display = 'none';
    document.getElementById('circularS5').style.display = 'none';
    deleteBall(5);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-6').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-6').style.display = 'none';
    document.getElementById('front-item-6').style.display = 'none';
    document.getElementById('side-item-6').style.display = 'none';
    document.getElementById('circular6').style.display = 'none';
    document.getElementById('circularF6').style.display = 'none';
    document.getElementById('circularS6').style.display = 'none';
    deleteBall(6);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-7').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-7').style.display = 'none';
    document.getElementById('front-item-7').style.display = 'none';
    document.getElementById('side-item-7').style.display = 'none';
    document.getElementById('circular7').style.display = 'none';
    document.getElementById('circularF7').style.display = 'none';
    document.getElementById('circularS7').style.display = 'none';
    deleteBall(7);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-8').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-8').style.display = 'none';
    document.getElementById('front-item-8').style.display = 'none';
    document.getElementById('side-item-8').style.display = 'none';
    document.getElementById('circular8').style.display = 'none';
    document.getElementById('circularF8').style.display = 'none';
    document.getElementById('circularS8').style.display = 'none';
    deleteBall(8);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-9').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-9').style.display = 'none';
    document.getElementById('front-item-9').style.display = 'none';
    document.getElementById('side-item-9').style.display = 'none';
    document.getElementById('circular9').style.display = 'none';
    document.getElementById('circularF9').style.display = 'none';
    document.getElementById('circularS9').style.display = 'none';
    deleteBall(9);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('head-item-10').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-10').style.display = 'none';
    document.getElementById('front-item-10').style.display = 'none';
    document.getElementById('side-item-10').style.display = 'none';
    document.getElementById('circular10').style.display = 'none';
    document.getElementById('circularF10').style.display = 'none';
    document.getElementById('circularS10').style.display = 'none';
    deleteBall(10);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-1').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-1').style.display = 'none';
    document.getElementById('front-item-1').style.display = 'none';
    document.getElementById('side-item-1').style.display = 'none';
    document.getElementById('circular1').style.display = 'none';
    document.getElementById('circularF1').style.display = 'none';
    document.getElementById('circularS1').style.display = 'none';
    deleteBall(1);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-2').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-2').style.display = 'none';
    document.getElementById('front-item-2').style.display = 'none';
    document.getElementById('side-item-2').style.display = 'none';
    document.getElementById('circular2').style.display = 'none';
    document.getElementById('circularF2').style.display = 'none';
    document.getElementById('circularS2').style.display = 'none';
    deleteBall(2);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-3').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-3').style.display = 'none';
    document.getElementById('front-item-3').style.display = 'none';
    document.getElementById('side-item-3').style.display = 'none';
    document.getElementById('circular3').style.display = 'none';
    document.getElementById('circularF3').style.display = 'none';
    document.getElementById('circularS3').style.display = 'none';
    deleteBall(3);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-4').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-4').style.display = 'none';
    document.getElementById('front-item-4').style.display = 'none';
    document.getElementById('side-item-4').style.display = 'none';
    document.getElementById('circular4').style.display = 'none';
    document.getElementById('circularF4').style.display = 'none';
    document.getElementById('circularS4').style.display = 'none';
    deleteBall(4);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-5').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-5').style.display = 'none';
    document.getElementById('front-item-5').style.display = 'none';
    document.getElementById('side-item-5').style.display = 'none';
    document.getElementById('circular5').style.display = 'none';
    document.getElementById('circularF5').style.display = 'none';
    document.getElementById('circularS5').style.display = 'none';
    deleteBall(5);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-6').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-6').style.display = 'none';
    document.getElementById('front-item-6').style.display = 'none';
    document.getElementById('side-item-6').style.display = 'none';
    document.getElementById('circular6').style.display = 'none';
    document.getElementById('circularF6').style.display = 'none';
    document.getElementById('circularS6').style.display = 'none';
    deleteBall(6);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-7').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-7').style.display = 'none';
    document.getElementById('front-item-7').style.display = 'none';
    document.getElementById('side-item-7').style.display = 'none';
    document.getElementById('circular7').style.display = 'none';
    document.getElementById('circularF7').style.display = 'none';
    document.getElementById('circularS7').style.display = 'none';
    deleteBall(7);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-8').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-8').style.display = 'none';
    document.getElementById('front-item-8').style.display = 'none';
    document.getElementById('side-item-8').style.display = 'none';
    document.getElementById('circular8').style.display = 'none';
    document.getElementById('circularF8').style.display = 'none';
    document.getElementById('circularS8').style.display = 'none';
    deleteBall(8);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-9').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-9').style.display = 'none';
    document.getElementById('front-item-9').style.display = 'none';
    document.getElementById('side-item-9').style.display = 'none';
    document.getElementById('circular9').style.display = 'none';
    document.getElementById('circularF9').style.display = 'none';
    document.getElementById('circularS9').style.display = 'none';
    deleteBall(9);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('front-item-10').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-10').style.display = 'none';
    document.getElementById('front-item-10').style.display = 'none';
    document.getElementById('side-item-10').style.display = 'none';
    document.getElementById('circular10').style.display = 'none';
    document.getElementById('circularF10').style.display = 'none';
    document.getElementById('circularS10').style.display = 'none';
    deleteBall(10);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-1').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-1').style.display = 'none';
    document.getElementById('front-item-1').style.display = 'none';
    document.getElementById('side-item-1').style.display = 'none';
    document.getElementById('circular1').style.display = 'none';
    document.getElementById('circularF1').style.display = 'none';
    document.getElementById('circularS1').style.display = 'none';
    deleteBall(1);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-2').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-2').style.display = 'none';
    document.getElementById('front-item-2').style.display = 'none';
    document.getElementById('side-item-2').style.display = 'none';
    document.getElementById('circular2').style.display = 'none';
    document.getElementById('circularF2').style.display = 'none';
    document.getElementById('circularS2').style.display = 'none';
    deleteBall(2);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-3').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-3').style.display = 'none';
    document.getElementById('front-item-3').style.display = 'none';
    document.getElementById('side-item-3').style.display = 'none';
    document.getElementById('circular3').style.display = 'none';
    document.getElementById('circularF3').style.display = 'none';
    document.getElementById('circularS3').style.display = 'none';
    deleteBall(3);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-4').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-4').style.display = 'none';
    document.getElementById('front-item-4').style.display = 'none';
    document.getElementById('side-item-4').style.display = 'none';
    document.getElementById('circular4').style.display = 'none';
    document.getElementById('circularF4').style.display = 'none';
    document.getElementById('circularS4').style.display = 'none';
    deleteBall(4);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-5').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-5').style.display = 'none';
    document.getElementById('front-item-5').style.display = 'none';
    document.getElementById('side-item-5').style.display = 'none';
    document.getElementById('circular5').style.display = 'none';
    document.getElementById('circularF5').style.display = 'none';
    document.getElementById('circularS5').style.display = 'none';
    deleteBall(5);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-6').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-6').style.display = 'none';
    document.getElementById('front-item-6').style.display = 'none';
    document.getElementById('side-item-6').style.display = 'none';
    document.getElementById('circular6').style.display = 'none';
    document.getElementById('circularF6').style.display = 'none';
    document.getElementById('circularS6').style.display = 'none';
    deleteBall(6);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-7').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-7').style.display = 'none';
    document.getElementById('front-item-7').style.display = 'none';
    document.getElementById('side-item-7').style.display = 'none';
    document.getElementById('circular7').style.display = 'none';
    document.getElementById('circularF7').style.display = 'none';
    document.getElementById('circularS7').style.display = 'none';
    deleteBall(7);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-8').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-8').style.display = 'none';
    document.getElementById('front-item-8').style.display = 'none';
    document.getElementById('side-item-8').style.display = 'none';
    document.getElementById('circular8').style.display = 'none';
    document.getElementById('circularF8').style.display = 'none';
    document.getElementById('circularS8').style.display = 'none';
    deleteBall(8);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-9').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-9').style.display = 'none';
    document.getElementById('front-item-9').style.display = 'none';
    document.getElementById('side-item-9').style.display = 'none';
    document.getElementById('circular9').style.display = 'none';
    document.getElementById('circularF9').style.display = 'none';
    document.getElementById('circularS9').style.display = 'none';
    deleteBall(9);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});
document.getElementById('side-item-10').addEventListener("mousedown",function(){
    confirm_index += 1;
    if (confirm_index == totalAnnotation) window.location.assign('/templates/interface/submit.html')

    document.getElementById('head-item-10').style.display = 'none';
    document.getElementById('front-item-10').style.display = 'none';
    document.getElementById('side-item-10').style.display = 'none';
    document.getElementById('circular10').style.display = 'none';
    document.getElementById('circularF10').style.display = 'none';
    document.getElementById('circularS10').style.display = 'none';
    deleteBall(10);
    document.onmousedown = null;

    document.getElementById('source').src = '/templates/interface/assets/audio/test'+(unconfirmed_annotations[confirm_index]).toString()+'.wav';
    document.getElementById('audio').load();
    document.getElementById('audio-frame-confirm').innerHTML='Play Audio '+(confirm_index+1).toString();
    document.getElementById('audio-frame').style.background = "linear-gradient(to right, #efefef 0%, #ffffff 0%)";

});

/* Three.js */

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