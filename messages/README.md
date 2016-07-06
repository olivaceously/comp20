#README.md
Lab 6: Messages

Olivia MacDougal

7 March 2016

Implementation Specifics:

	Everything has been implemented in full.

Acknowledgements:

	> the course website, including the notes from class esp. about AJAX and JSON
	> the course Github page examples - specifically the redline.html example and 
	  the style.css for the in-class fml.html example (I liked the bubbles around the text!)
	> For reference:

			- On same-origin policy: https://en.wikipedia.org/wiki/Same-origin_policy
			- On XMLHttpRequests: https://en.wikipedia.org/wiki/XMLHttpRequest

Time Spent Completeing Assignment:

	I spent about 2.5 hours completing this assignment.

Part 2: Loading the Data From Local Machine


	It is not possible to request the data from my local maching (from file://) using XMLHttpRequest.
	When I try to open the file after I've turned off the server, it no longer works.
	The Javascript console returns the following error: 
	"XMLHttpRequest cannot load file:///home/tuftscs/comp20/comp20-omacdougal/messages/data.json. 
	Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, 
	https, chrome-extension-resource."
	This makes sense because of the same-origin policy - essentially, by requesting the data from my local machine,
	I am trying to use cross site scripting, which is BAD. Cross site scripting is a security issue 
	because it allows an attacker to change the Javascript. Not only does it make sense that it doesn't,
	but it is a good thing that it doesn't work - I don't want anyone hacking my website! Also, when I was
	hosting the temporary python server, the .json file was requested from the same origin as where the index.html
	was being hosted.


Part 3: Loading the Data Given a URI


	After changing the origin that the data is being requested from (now requesting it from the given URI),
	the messages once again do not appear. The Javascript console returns the following error:
	XMLHttpRequest cannot load https://messagehub.herokuapp.com/messages.json. No 'Access-Control-Allow-Origin' 
	header is present on the requested resource. Origin 'null' is therefore not allowed access.
	Similar to above, this error is a result of the failing the same-origin policy. From Wikipedia, 
	"For security reasons, XMLHttpRequest requests follow the browser's same-origin policy, and will therefore only 
	succeed if they are made to the host that served the original web page." Obviously my page is not hosted
	on the same server as the Heroku webpage. This is actually really cool/kind of an ingenious way to protect
	your website! :D



