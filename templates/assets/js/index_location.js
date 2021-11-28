// TODO: IMPLEMENT DELETION
function deleteAzimuth(){
	input_count = document.getElementById('count').value;
	if (azimuth[0] == undefined){
		window.alert("You have not entered any azimuth source");
	}
	else{
		azimuth_index -= 1;
		azimuth[azimuth_index] = undefined;
	}
}

// TODO: IMPLEMENT DELETION
function deleteElevation(){
	input_count = document.getElementById('count').value;
	if (elevation[0] == undefined){
		window.alert("You have not entered any elevation source");
	}
	else{
		elevation_index -= 1;
		elevation[elevation_index] = undefined;
	}
}