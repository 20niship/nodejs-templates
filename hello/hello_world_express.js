// $ npm install express # これをJS実行前に実行して、Expressをインストールする

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

app.use(function(req, res, next){
  console.log("New access " + req.method + "\t" + req.url);
  next();
});

app.get('/home', function(req, res) {
  res.type('text/html').send(`<h1>This is home!!</h1><p><a href="/">open index.html</a></p>`)
});


app.get('/', function(req, res) {
    fs.readFile("./index.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});

app.get('/style.css', function(req, res) {
  fs.readFile("./style.css", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(data);
      res.end();
  });
});

app.get('/redirect', function(req, res) {
  res.redirect("/home");
});


app.get('/form', function(req, res) {
  res.type('text/html').send(`
    <!DOCTYPE html>
    <html>
      <head><title>Form sample</title></head>
      <body>
        <h1>Form sample</h1>
        <form action="/post" method="POST">
          <input type="text" name="text1"><br>
          <input type="text" name="text2">
          <input type="submit" value="送信">
        </form>
      </body>
    </html>
  `)
});

app.post('/post',function(req, res, next){
  console.log(req.body);
  res.send(req.body);
});

app.listen(8000);