// Load the http module to create an http server.
var 	http = require('http'),
	fs = require('fs');

fs.readFile('./index.html', function (err, html) {
	if (err) {
		throw err;
	}
	http.createServer(function(request, response) {
		response.writeHeader(200, {"Content-Type": "text/html"});
		response.end(html);
	}).listen(8000); // Port to listen on
});

/*
// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end("./index.html");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);
*/

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
