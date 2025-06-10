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
	    popup("file uploaded successfully", document.getElementById("upload-status"), "success");
	},
	function(e) {
	    popup("file uploaded failed to upload: " + e, document.getElementById("upload-status"), "error");
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
    const flTable = document.getElementById("current-files");
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

const uploadSubmitButton = document.getElementById("file-upload-submit");
uploadSubmitButton.addEventListener("click", uploadCode);
fillDownloadTable();
