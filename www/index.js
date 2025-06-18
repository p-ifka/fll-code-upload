function popup(txt, parent, parentClass) {
    /**
     * generate a popup with text 'txt', clear innerHTML of 'parent' and append popup,
     * set 'parent' class to 'parentClass'
     **/
    parent.innerHTML = '';	// clear any popups or other elements currently in 'parent'
    parent.className = parentClass // set class of parent

    /* create popup text */
    let txtp = document.createElement("p");
    txtp.innerHTML = txt;

    /* create x button */
    let xb = document.createElement("button");
    xb.innerHTML = "x";

    /* when x clicked, clear popup */
    xb.addEventListener("click", function(e) {
	parent.innerHTML = '';
    });

    parent.appendChild(txtp)
    parent.appendChild(xb)
}

async function uploadCode(e) {
    /**
     * create POST request to /upload/{NAME} with
     **/
    console.log("upload code button pressed")
    const submitDiv = document.getElementById("upload");
    const fileInput = document.getElementById("file-upload");
    const teamIdType = document.getElementById("team-id-type");
    const teamId = document.getElementById("team-id");

    const teamIdTxt = teamId.value.toUpperCase();
    const teamidRegex = /^[A-Z]{1}$|^[0-9]{1,2}$/; // only pass strings that from start to end contain 1 capital letter or 1 or 2 digits

    if(fileInput.files.length <= 0) {
	errorPopup("select a file to submit", document.getElementById("upload-err"), "error");$
	return;
    }
    if(!teamidRegex.test(teamIdTxt)) {
	popup("team name is invalid: must be a 2-digit number or letter", document.getElementById("upload-status"), "error");
	return;
    }

    let rqBody = new FormData();
    rqBody.append("file", fileInput.files[0]);
    let ret = fetch(
	"/upload/" + teamIdType.value + "-" + teamIdTxt,
	{method: "POST", body: rqBody}
    ).then(
	function(i) {
	    popup(
		"file uploaded successfully",
		document.getElementById("upload-status"),
		"success");
	    fillDownloadTable();
	    console.log("disabling submit button");
	    e.target.disabled = true;
	    setTimeout(function() { console.log("enabling submit button"); e.target.disabled = false;}, 5000);
	},
	function(e) {
	    popup(
		"failed to upload: " + e,
		document.getElementById("upload-status"),
		"error"
	    );
	}
    );
}

async function getFileList() {
    let ret = await fetch("/get-code/", {method: "GET"});
    if(!ret.ok) {
	popup("failed to get file list: " + ret, document.getElementById("download-status"), "error");
	return 1;
    }
    let txt = await ret.text();
    return txt;
}

async function fillDownloadTable() {
    console.log("populating download table");
    const flTable = document.getElementById("current-files");
    const flTableHeader = document.getElementById("current-files-header");
    flTable.innerHTML = "";
    flTable.appendChild(flTableHeader);
    let fl = getFileList().then(
	async function(flText) {
	    let files = flText.split("\n");
	    for(i in files) {
		if(i == files.length-1) { break; }
		let fileData = files[i].split(",");

		let tr = document.createElement("tr");
		let nameTD = document.createElement("td");
		let dateTD = document.createElement("td");
		let linkTD = document.createElement("td");
		let fileLink = document.createElement("a");

		fileLink.innerHTML = "download"
		fileLink.href = "/files/" + fileData[0] + "/" + fileData[2]
		fileLink.download = "code.llsp"

		nameTD.innerHTML = fileData[0];
		dateTD.innerHTML = fileData[1];
		linkTD.appendChild(fileLink);

		tr.appendChild(nameTD);
		tr.appendChild(dateTD);
		tr.appendChild(linkTD);
		flTable.appendChild(tr);
	    }
	}
    );


}

async function generateExport() {
    /**
     * run CGI script to generate archive for exporting, create a popup to notify the user if:
     * success: archive geerated
     * warn: archive already exists, no new archive generated
     * error: script failed to execute
     * error: script failed to start tar process
     * error: tar process failed after starting
     **/
    console.log("generate export clicked");
    let rc = await fetch("/compress-files/", {method: "POST"});
    console.log(rc);
    if(rc.status == 200) {
	popup(
	    "archive created successfully",
	    document.getElementById("export-status"),
	    "success"
	);
    } else if(rc.status == 304) {
	popup(
	    "304: no new archive created, archive is already up-to-date" + await rc.text(),
	    document.getElementById("export-status"),
	    "warn"
	);
    } else if(rc.status == 503) {
	popup(
	    "503: " + await rc.text(),
	    document.getElementById("export-status"),
	    "error"
	);
    } else if(rc.status == 500) {
	popup(
	    "500: " + await rc.text(),
	    document.getElementById("export-status"),
	    "error"
	);
    }
    

    

}
console.log("INDEX.JS");
const uploadSubmitButton = document.getElementById("file-upload-submit");
const generateArchiveButton = document.getElementById("generate-tar");
uploadSubmitButton.addEventListener("click", uploadCode);
generateArchiveButton.addEventListener("click", generateExport);
fillDownloadTable();
