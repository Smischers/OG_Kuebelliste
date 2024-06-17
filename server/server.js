const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const data = require('./dataModel.js');
const endpoints = require('./files/Endpoints.js')
//Source for User Login: https://www.youtube.com/watch?v=Ud5xKCYQTjM
//Source for JWT: https://www.youtube.com/watch?v=mbsmsi7l3r4

const express = require('express')
 const path = require('path')
const bodyParser = require('body-parser')
const data = require('./dataModel.js') 
const app = express()

//Load the Token variables from .env to the Token creation here
require('dotenv').config()
//Import jwt libary
const jwt = require('jsonwebtoken')


const bcrypt = require('bcrypt')

//any incoming request with a JSON body will be parsed, and the resulting object will be accessible in req.body
app.use(express.json())

//Test Array for JWT Testing
const posts = [
  {
    username: 'Julian',
    title: 'Post1'
  },
  {
    username: 'Mihael',
    title: 'Post2'
  }
]
// Parse urlencoded bodies
app.use(bodyParser.json());


// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/list', endpoints.getList);
app.get('/list/:listName', endpoints.getListByName);
app.get('/listIcons', endpoints.getListNamesIcons);

app.post('/list', endpoints.createList);
app.post('/list/:listName', endpoints.createCategory);
app.post('/list/:listName/:categoryName', endpoints.createEntry);

app.put('/list', endpoints.updateLists);
app.put('/list/:listName/categorys', endpoints.updateCategorys);
//app.put('/list/:listName/:categoryName/:entryName',endpoints.updateEntry);

app.delete('/list/:listName', endpoints.deleteList);
app.delete('/list/:listName/:categoryName', endpoints.deleteCategory);
app.delete('/list/:listName/:categoryName/:entryName', endpoints.deleteEntry);
// Nicht mein Problem machts ihr Backend Boys
app.get('/', function (req, res) {
  res.sendStatus(403)
}) 

/* ------------------------------------------------------------------------------------------------------------ */
//User Login

//Test Array to save the Users and Passwords
const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

//Creating User / Hashing the Password / Save the Password in the Array
app.post('/users', async (req, res) => {
  try {
    //Salt makes every hashed password unique (at the beginn of the encr. passw.)
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log('Salt: ' + salt)
    console.log('Complete encrypted User Password: ' + hashedPassword)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

//User Session Management
app.get('/posts', authenticateToken, (req, res) => {
  //Only post the User which have access to
  res.json(posts.filter(post => post.username === req.user.name))
})


//Login a particular User and check the User/Password
app.post('/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  console.log(user)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    //Check if the typed pw is the same like in the database
    if( await bcrypt.compare(req.body.password, user.password)){

      //User from the database 
      const username = user.name
      console.log('Username: ' + username)
      const userPayload = { name: username }
      console.log('Payload:' + userPayload)
      console.log('Successfull login')
      //Create a Access Token from .env File and save the user data in it
      const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken: accessToken })

      console.log(accessToken)

    } else {
      res.send('Password is not correct')
    }
  } catch {
    res.status(500).send()
  }
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']

  //If we have an Auth Header -> return auth header token portion
  const token = authHeader && authHeader.split(' ')[1]
  //If not ->return unauthorized
  if (token == null) return res.sendStatus(401)

  //Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //If err -> Token not longer valid (no accress)
    if (err) return res.sendStatus(403)
    //Set the user for the request  
    req.user = user
    next()
  })
}


app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

