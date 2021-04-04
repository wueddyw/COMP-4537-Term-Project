const express = require('express')
const http = require('http')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const router = express.Router();
const port = process.env.PORT || 3000
const con = mysql.createPool({
  connectionLimit : 10,
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'bf690f4699d417',
  password: 'f487f0ce',
  database: 'heroku_8efe97cb5d411b8'
});

app.use(cors())
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/API/V1/loadtweets', (req, res) => {
  addRequest('/API/V1/loadtweets')
  res.end("Loading tweet")
})

app.post('/API/V1/login', (req, res) => {
  addRequest('/API/V1/login')
  res.end("Logging in")
})

app.get('/API/V1/getStats', (req, res) => {
  res.writeHead(200, { 
    'Content-type': 'text/html',
    'Access-Control-Allow-Origin': '*'
 });
  con.query('Select * from EndpointCounter', function(error,results,fields){
    console.log(typeof results);
    res.end(JSON.stringify(results))
    
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

function addRequest(endpoint){
  con.query('update EndpointCounter set requests = requests + 1 where endpoint = "'+ endpoint + '"', function(error,results,fields){
      console.log(results);
  })
}
