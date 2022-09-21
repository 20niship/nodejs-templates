
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  console.log("hoge")
  res.sendFile(__dirname + "/index.html");
})

app.get('/bundle.js', (req, res) => {
  console.log("huga")
  res.sendFile(__dirname + "/bundle.js");
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})