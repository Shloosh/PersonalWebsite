var express = require('express')
var app = express()

app.use(express.static('src/', {
    extensions: ['html', 'htm']
}))

app.get('/', function(req, res) {
  res.send("Hello World!")
})

app.post('/', function (req, res) {
  res.send('Got a POST request')
})

app.listen(8000, function() {
  console.log("hello world express")
})
