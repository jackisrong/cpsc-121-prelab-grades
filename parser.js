const GRADESCOPE_HEADERS = {
	Id: 'Name',
	TotalScore: 'Total Score',
	Status: 'Status'
}

let preLabGradesMap;

function submitForm() {
	// reset global vars
	preLabGradesMap = new Map();

	// reset warning section
	document.getElementById('warning').style.display = 'none';
	document.getElementById('warning-text').innerHTML = '';
	
	// get prelab file from file selector
	let prelabFile = document.getElementById('gradescope-csv').files[0];
	
	// check if file exists
	if (!prelabFile) {
		document.getElementById('warning').style.display = 'block';
		document.getElementById('warning-text').innerHTML = 'No pre-lab grades file was uploaded!<br>';
		outputResult();
		return;
	}

	// parse prelab grades file using PapaParse
	// on callback: filter & map data to ids
	Papa.parse(prelabFile, {
		header: true,
		complete: (results) => {
			mapPrelabGradeData(results.data);
		}
	});
}

function mapPrelabGradeData(gradesArray) {
	// populate map with [ID, prelab grade] pairs if it's graded
	gradesArray.forEach((row) => {
		if (row[GRADESCOPE_HEADERS.Status] == 'Graded') {
			preLabGradesMap.set(row[GRADESCOPE_HEADERS.Id], row[GRADESCOPE_HEADERS.TotalScore]);
		}
	});
	outputResult();
}

function outputResult() {
	// get the ID list from the text area
	// filter() removes any empty values that might have been added by additional new lines
	let idArray = document.getElementById('id-list').value.split("\n").filter(el => el);

	// get reference of results table
	let table = document.getElementById('result');
	
	// delete any rows (except header row) that already exist
	let numRows = table.rows.length;
	for (let i = 0; i < numRows - 1; i++) {
		document.getElementById('result').deleteRow(-1);
	}

	// set up inner tables (this is to support selecting/copying a single column of the table)
	let idTable = document.createElement('table');
	let gradeTable = document.createElement('table');
	let row = table.insertRow(-1);
	row.insertCell(-1).append(idTable);
	row.insertCell(-1).append(gradeTable);

	idArray.forEach((id) => {
		// insert cells with id to new row in idTable
		idTable.insertRow(-1).insertCell(-1).innerHTML = id;

		// insert cell with grade to new row in gradeTable
		if (preLabGradesMap.has(id)) {
			gradeTable.insertRow(-1).insertCell(-1).innerHTML = preLabGradesMap.get(id);
		} else {
			gradeTable.insertRow(-1).insertCell(-1).innerHTML = '---';
		}
	});
}


