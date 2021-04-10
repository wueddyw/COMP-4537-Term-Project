const express = require('express')
const http = require('http')
const mysql = require('mysql')
const cors = require('cors')
const e = require('express')
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

app.get('/API/V1/loadquacks', (req, res) => {
  addRequest('/API/V1/loadquacks')
  res.end("Loading quack")
})

app.get('/API/V1/loadcomments', (req, res) => {
  addRequest('/API/V1/comments')
  res.end("Loading comments")
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

app.post('/API/V1/login', (req, res) => {
  addRequest('/API/V1/login')
  res.end("Logging in")
})

app.post('/API/V1/register', (req, res) => {
  addRequest('/API/V1/register')
  res.end("Registering user")
})

app.post('/API/V1/validsession', (req, res) => {
  addRequest('/API/V1/validsession')
  res.end("Validating session")
})

app.post('/API/V1/createcomment', (req, res) => {
  let data = JSON.parse(req.body)
  addRequest('/API/V1/createcomment')
  if(typeof data.username !=='undefined' && typeof data.content !=='undefined' && typeof data.quackid !== 'undefined'){
    con.query('INSERT INTO comment (username,comment) VALUES ("'+ data.username+'","'+ data.comment +'")', function(error,results,fields){
      if(error) throw error;
      con.query('INSERT INTO quotecomment (quackid,commentid) VALUES ("'+ results[0].quackid+'","'+ results[0].commentid +'")', function(error,results,fields){
        if(error) throw error;
        res.end("Creating comment")
      })
    })
  }else{
    res.end("Invalid data")
  }
})

app.post('/API/V1/createquack', (req, res) => {
  let data = JSON.parse(req.body)
  addRequest('/API/V1/createquack')
  if(typeof data.username !=='undefined' && typeof data.content !== 'undefined'){
    con.query('INSERT INTO quack (username,content) VALUES ("'+ data.username+'","'+ data.content +'")', function(error,results,fields){
      if(error) throw error;
      res.end("Creating quack")
    })
  } else{
    res.end("Invalid data")
  }
})

app.delete('/API/V1/deletecomment', (req, res) => {
  let data = JSON.parse(req.body)
  addRequest('/API/V1/deletecomment')
  res.end("Deleting comment")
})

app.delete('/API/V1/deletequack', (req, res) => {
  let data = JSON.parse(req.body)
  addRequest('/API/V1/deletequack')
  if(typeof data.quackid !=='undefined')
  {
    con.query('DELETE from quackcomment where id = '+ data.quackid, function(error,results,fields){
      if(error) throw error;
    })
    con.query('Select * from quackcomment where id = '+ data.quackid, function(error,results,fields){
      if(error) throw error;
      for(i = 0; i < results.length(); i++){
        con.query('DELETE from comment where id = '+ results.commentid, function(error,results,fields){
          if(error) throw error;
        })
      }
    })
    con.query('DELETE from quack where id = '+ data.quackid, function(error,results,fields){
      if(error) throw error;
      res.end("Deleting quack")
    })
  }else{
    res.end("Invalid quack")
  }
})

app.put('/API/V1/editcomment', (req, res) => {
  let data = JSON.parse(req.body)
  addRequest('/API/V1/editcomment')
  if(typeof data.commentid !== 'undefined' && typeof data.comment !== 'undefined'){
  con.query('UPDATE comment SET comment ="'+data.comment+'" WHERE id='+ data.commentid, function(error,results,fields){
      if(error) throw error;
      res.end("Editing comment")
    })
  } else{
    res.end("Invalid data")
  }
})

app.put('/API/V1/editquack', (req, res) => {
  let data = JSON.parse(req.body)
  addRequest('/API/V1/editcomment')
  if(typeof data.quackID !== 'undefined' && typeof data.content !== 'undefined'){
  con.query('UPDATE quack SET content ="'+data.Content+'" WHERE id='+ data.quackid, function(error,results,fields){
      if(error) throw error;
      res.end("Editing comment")
    })
  } else{
    res.end("Invalid data")
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

function addRequest(endpoint){
  con.query('update EndpointCounter set requests = requests + 1 where endpoint = "'+ endpoint + '"', function(error,results,fields){
      console.log(results);
  })
}
