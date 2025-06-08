const codeSubmissionDiv = document.getElementById("code-submission");
const fileUpload = document.getElementById("file-upload");
const fileSubmit = document.getElementById("file-upload-submit");
const teamIdType = document.getElementById("team-id-type");
const teamId = document.getElementById("team-id");

fileSubmit.addEventListener("click", function(e) {
    console.log("submit button clicked")
    if(teamId.value != "" && fileUpload.files.length > 0) {
	console.log("submit");
	let file = fileUpload.files[0];
	let rqBody = new FormData();
	rqBody.append("file", file);
	let teamIdent = teamIdType.value + "-" teamId.value;
	console.log(teamIdent)
	fetch("/upload/" + teamIdent, {method: "POST", body: rqBody});
    } else {
	console.log("missing team name and/or file")
    }
});
