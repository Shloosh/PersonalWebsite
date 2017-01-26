// ====== Basic HTTP server #1 ======

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





// ====== Basic HTTP server #2 ======

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8000;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri)
    , file = uri.substring(uri.lastIndexOf('/') + 1);

  if (file.indexOf('.') == -1 && file != '') {
    uri += ".html";
    filename += ".html";
  }

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += 'home.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
