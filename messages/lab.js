/* COMP 20 - Lab 6
 * Olivia MacDougal
 * referenced https://github.com/tuftsdev/WebProgramming/blob/gh-pages/examples/ajax/redline.html
 */

function parse() {
	// make XML request and handle response
	request = new XMLHttpRequest();
	request.open("GET", "https://messagehub.herokuapp.com/messages.json", true);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			theMessageData = JSON.parse(request.responseText); // parse the JSON file

			message = document.getElementById("messages");	//get div in HTML 

			for (i = 0; i < theMessageData.length; i++) {	//insert data into HTML
			message.innerHTML += "<p>" + theMessageData[i]["content"] + " " 
							  + theMessageData[i]["username"] + "</p>";
			}
		}
	};

	request.send(null); // don't need to send any data back, so send null

}
