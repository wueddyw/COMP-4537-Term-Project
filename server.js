const express = require('express')
const http = require('http')
const mysql = require('mysql')
const app = express()
const router = express.Router();
const port = process.env.PORT || 3000
const dbCon = mysql.createPool({
    connectionLimit: 10,
    host: "",
    user: "",
    password: "",
    database: ""
});


app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/css', express.static(__dirname + 'public/js'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
