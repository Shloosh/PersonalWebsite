var express = require('express'),
    url = require('url'),
    favicon = require('serve-favicon')
var app = express()

app.use(favicon(__dirname + '/src/favicon.ico'))

app.use(function (req, res, next) {
  var uri = url.parse(req.url).pathname
    , file = uri.substring(uri.lastIndexOf('/') + 1);

  if (file.contains('.html') || file.contains('.htm')) {
    res.status(404).send('Cannot GET ' + uri);
  }

  next()
})

// app.get('/', function(req, res) {
//   console.log('sending home');
//   res.sendFile('home.html', { root: __dirname + '/src/' })
// })

app.use('/', express.static('src/', {
  index: 'home.html',
  extensions: ['html', 'htm']
}))

app.post('/', function (req, res) {
  res.send('Got a POST request')
})

app.listen(8000, function() {
  console.log("Starting server...")
})

// Helpers

Object.prototype.contains = function(containedStr) {
  return (this.indexOf(containedStr) != -1)
}
