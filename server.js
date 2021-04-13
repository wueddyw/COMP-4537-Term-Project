require('dotenv').config();
const express = require('express')
const http = require('http')
const mysql = require('mysql')
const cors = require('cors')
const e = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
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

app.get('/API/V1/loadquacks',authenticateToken ,(req, res) => {
  addRequest('/API/V1/loadquacks')
  con.query('Select * from quack', function(error,results,fields){
    if(error) console.log(error);
    if(results[0] == undefined){
      res.status(400)
      res.end("Empty there are no quacks")
    } else{
      res.json(results)
    }
  })
})

app.get('/API/V1/loadcomments',authenticateToken, (req, res) => {
  addRequest('/API/V1/comments')
  con.query('Select c.username, c.comment '+
    'FROM Quack q '+
    'INNER JOIN QuackComment qc ON q.quackid = qc.quackid '+ 
    'INNER JOIN Comment c ON qc.commentid = c.commentid '+
    'WHERE q.quackid = "' + req.query.quackid + '"', function(error,results,fields){
    if(error) console.log(error);
    if(results[0] == undefined){
      res.status(400)
      res.end("Empty there are no comments")
    } else{
      res.status(200)
      res.json(results)
    }
  })
})

app.get('/API/V1/getStats', authenticateToken,(req, res) => {
  con.query('Select * from EndpointCounter', function(error,results,fields){
    res.status(200)
    console.log(typeof results);
    res.end(JSON.stringify(results))
    
  })
})

app.post('/API/V1/validsession', (req,res) => {
  const refreshToken = req.body.token
  if(refreshToken == null) return res.sendStatus(401)
  con.query('Select * from tokens where token = "'+  refreshToken + '"', function(error,results,fields){
    if(error) {
      console.log("error")
    } else if(results[0] === undefined){
      res.sendStatus(403)
    } else{
       jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
         if (err) return res.sendStatus(403)
         const accessToken = generateAccessToken({username : user.username})
        //  res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
         res.json({accessToken : accessToken})
       })
    }
  })
})

app.post('/API/V1/login', (req, res) => {
  let data = req.body
  addRequest('/API/V1/login')
  con.query('Select * from user where username = "'+  data.username + '"', function(error,results,fields){
    if(error) {
      console.log("error")
    } else if(results[0] === undefined){
      res.end("Your username or password doesn't exist or it was invalid")
    } else{
        console.log(bcrypt.compareSync(data.password, results[0].password));
        if(bcrypt.compareSync(data.password, results[0].password)){
          const user = { username: data.username}
          const accessToken = generateAccessToken(user)
          const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
          con.query('INSERT INTO tokens (token) VALUES ("'+ refreshToken+ '")', function(error,results,fields){
            if(error) console.log(error);
            // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
            res.status(200)
            res.json({accessToken: accessToken, refreshToken: refreshToken})
          })
        } else{
          res.status(401)
          res.end("Your username or password doesn't exist or it was invalid")
        }
      }
  })
})

app.delete('/API/V1/logout', (req,res) => {
  con.query('DELETE from tokens where token = "'+ req.body.token+'"', function(error,results,fields){
    if(error) {
      console.log(error);
    } else{
      // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
      res.sendStatus(204);
    }
  })
})

app.post('/API/V1/register', (req, res) => {
  let data = req.body
  addRequest('/API/V1/register')
  con.query('Select * from user where username = "'+  data.username + '"', function(error,results,fields){
    if(error) {
      console.log("error")
    } else if(results[0] === undefined){
      con.query('Select * from user where email = "'+  data.email + '"', function(error,resultss,fields){
        if(error) {
          console.log("error")
        } else if(resultss[0] === undefined){
          if(typeof data.username !=='undefined' && typeof data.email !=='undefined' && typeof data.firstname !== 'undefined' && typeof data.lastname !== 'undefined'
          && typeof data.password !== 'undefined' && data.username !=="" && data.email !=="" && data.firstname !== "" && data.lastname !== ""
          && data.password !== ""){
            con.query('INSERT INTO user (username,firstname,lastname,email,password) VALUES ("'+ data.username+'","'+ data.firstname +'","'
            + data.lastname +'","'+ data.email +'", "'+ bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10),null) +'")', function(error,results,fields){
              if(error) console.log("error");
              // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
              res.status(201)
              res.end("Created user")
            })
        } else{
          res.status(400)
          res.end("Invalid data")
        }
      }else{
        res.status(400)
        res.end("Email already exists")
      }
    })}else{
      res.status(400)
      res.end("User name already exists")
    }
  })
})

app.post('/API/V1/createcomment', authenticateToken,(req, res) => {
  let data = req.body
  addRequest('/API/V1/createcomment')
  con.query('Select * from user where username = "'+  data.username + '"', function(error,results,fields){
    if(error) {
      console.log("error")
    } else if(results[0] === undefined){
      res.status(400)
      res.end("Invalid data")
    }else{
      con.query('Select * from quack where QuackID = "'+  data.quackid + '"', function(error,results,fields){
        if(error) {
          console.log("error")
        } else if(results[0] === undefined){
          res.status(400)
          res.end("Invalid data")
        } else{
          if(typeof data.username !=='undefined' && typeof data.comment !=='undefined' && typeof data.quackid !== 'undefined' && 
          data.username !=="" && data.comment !=="" && data.quackid !== ""){
            con.query('INSERT INTO comment (username,comment) VALUES ("'+ data.username+'","'+ data.comment +'")', function(error,results,fields){
              if(error) console.log(error);
              console.log(results);
              con.query('INSERT INTO quackcomment (quackid,commentid) VALUES ("'+ data.quackid+'","'+ results.insertId +'")', function(error,results,fields){
                if(error) console.log(error);
                // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
                res.status(201)
                res.end("Creating comment")
              })
            })
          }else{
            res.status(400)
            res.end("Invalid data")
          }
        }
      })
    }
  })
})

app.post('/API/V1/createquack', authenticateToken,(req, res) => {
  let data = req.body
  addRequest('/API/V1/createquack')
  con.query('Select * from user where username = "'+  data.username + '"', function(error,results,fields){
    if(error) {
      console.log("error")
    } else if(results[0] === undefined){
      res.status(400)
      res.end("Invalid data")
    }
    else {
      if(typeof data.username !=='undefined' && typeof data.content !== 'undefined' && data.username !=="" && data.content !== ""){
        con.query('INSERT INTO quack (username,content) VALUES ("'+ data.username+'","'+ data.content +'")', function(error,results,fields){
          if(error) console.log(error);
          // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
          res.status(201)
          res.end("Creating quack")
        })
      } else{
        res.status(400)
        res.end("Invalid data")
      }
    }
  })
})

app.delete('/API/V1/deletecomment',authenticateToken, (req, res) => {
  let data = req.body
  addRequest('/API/V1/deletecomment')
  if(typeof data.commentid !=='undefined'){
    con.query('DELETE from quackcomment where commentid = '+ data.commentid, function(error,results,fields){
      if(error) {
        console.log(error);
        sendStatus(400)
      }else{
        con.query('DELETE from comment where commentid = '+ data.commentid, function(error,results,fields){
          if(error) {
            console.log(error);
            sendStatus(400)
          } else{
            // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
            sendStatus(204)
            res.end("Deleted comment")
          }
        })
      }
    })
  }else{
    sendStatus(400);
    res.end("Comment doesnt exist")
  }
})

app.delete('/API/V1/deletequack', authenticateToken,(req, res) => {
  let data = req.body
  addRequest('/API/V1/deletequack')
  if(typeof data.quackid !=='undefined')
  {
    con.query('Select * from quackcomment where quackid = '+ data.quackid, function(error,results,fields){
      if(error) console.log(error);
      console.log(typeof results)
      con.query('DELETE from quackcomment where quackid = '+ data.quackid, function(error,results,fields){
        if(error) console.log(error);
        
      })
      for(i = 0; i < results.length; i++){
        con.query('DELETE from comment where commentid = '+ results[i].CommentID, function(error,results,fields){
          if(error) console.log(error);
        })
      }
      con.query('DELETE from quack where quackid = '+ data.quackid, function(error,results,fields){
        if(error) console.log(error);
        // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
        res.status(204)
        res.end("Deleting quack")
      })
    })
  }else{
    res.status(400)
    res.end("Invalid quack")
  }
})

app.put('/API/V1/editcomment', authenticateToken,(req, res) => {
  let data = req.body
  addRequest('/API/V1/editcomment')
  if(typeof data.commentid !== 'undefined' && typeof data.comment !== 'undefined'){
  con.query('UPDATE comment SET comment ="'+data.comment+'" WHERE commentid='+ data.commentid, function(error,results,fields){
    if(error) console.log(error);
      // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
      res.status(200)
      res.end("Editing comment")
    })
  } else{
    res.status(400)
    res.end("Invalid data")
  }
})

app.put('/API/V1/editquack', authenticateToken,(req, res) => {
  let data = req.body
  addRequest('/API/V1/editquack')
  if(typeof data.quackid !== 'undefined' && typeof data.content !== 'undefined'){
  con.query('UPDATE quack SET content ="'+data.content+'" WHERE quackid='+ data.quackid, function(error,results,fields){
    if(error) console.log(error);
      // res.setHeader("Access-Control-Allow-Origin","https://comp4537-termproject-client.herokuapp.com/")
      res.status(200)
      res.end("Editing quack")
    })
  } else{
    res.status(400)
    res.end("Invalid data")
  }
})


function addRequest(endpoint){
  con.query('update EndpointCounter set requests = requests + 1 where endpoint = "'+ endpoint + '"', function(error,results,fields){
      console.log(results);
  })
}

function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '900s'})
}

function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user.username);
    username = user.username
    next();
  });
}

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

