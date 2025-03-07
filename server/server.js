const express = require('express')
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const esoData = require('./eso.js')
const endpoints = require('./Endpoints.js')
const weather = require('./files/Ext-APIs/weather.js')
const animes = require('./files/Ext-APIs/anime.js')
const mangas = require('./files/Ext-APIs/manga.js')

const app = express()

app.use(cookieParser());

const userFilePath = './server/users.json'

// Load the Swagger configuration
const setupSwagger = require('./swaggerConfig');
setupSwagger(app);

//Load the Token variables from .env to the Token creation here
require('dotenv').config()

//any incoming request with a JSON body will be parsed, and the resulting object will be accessible in req.body
app.use(express.json())

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Returns all Lists
 *     tags: [List Handling]
 *     responses:
 *       200:
 *         description: Returns all lists of the "Database"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */


/**
 * @swagger
 * /list/{listName}:
 *   get:
 *     summary: Return one specific List
 *     tags: [List Handling]
 *     parameters:
 *       - in: path
 *         name: listName
 *         required: true
 *         example: ESO Dungeons
 *         schema:
 *           type: string
 *         description: Enter the list you want to have returned here
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       404:
 *         description: List not found
 */

app.get('/list',authenticateToken, endpoints.getList);
app.get('/list/:listName',authenticateToken, endpoints.getListByName);
app.get('/listIcons',authenticateToken, endpoints.getListNamesIcons);
app.get('/list/:listName/details',authenticateToken,endpoints.getListDetails);
app.get('/list/:listName/:categoryName/:entryName',authenticateToken,endpoints.getEntry);

/**
 * @swagger
 * /list:
 *   post:
 *     summary: Create a new List
 *     tags: [List Handling]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - picture
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the list
 *                 picture:
 *                   type: string
 *                   description: The URL to a Picture
 *             example:
 *               - name: Hiking routes
 *                 picture: https://www.alpenverein.de/img/containers/assets/artikel_bilder/tag-der-berge-unserealpen-01-dani__stelter.jpg/072c211bfe9355f3f4579c2dc8e66e85/tag-der-berge-unserealpen-01-dani__stelter.jpg
 *     responses:
 *       201:
 *         description: Added new List
 *       400:
 *         description: List already exists
 */

app.post('/list',authenticateToken, endpoints.createList);
app.post('/list/:listName',authenticateToken, endpoints.createCategory);
app.post('/list/:listName/:categoryName',authenticateToken, endpoints.createEntry);

app.put('/list/:listName',authenticateToken, endpoints.updateLists);
app.put('/list/:listName/:categoryName',authenticateToken, endpoints.updateCategorys);
app.put('/list/:listName/:categoryName/:entryName',authenticateToken,endpoints.updateEntry);
app.patch('/list/:listName/:categoryName/:entryName/change',authenticateToken, endpoints.changeCategory);

app.delete('/list/:listName',authenticateToken, endpoints.deleteList);
app.delete('/list/:listName/:categoryName',authenticateToken, endpoints.deleteCategory);
app.delete('/list/:listName/:categoryName/:entryName',authenticateToken, endpoints.deleteEntry);

/* ------------------------------------------------------------------------------------------------------------ */
//Weather Endpoints
app.get('/weather/allWeather/:city', weather.getAllWeatherData);
app.get('/weather/dayweather/:city', weather.getDayWeather);
app.get('/weather/weatherandtemp/:city', weather.getWeatherAndTemperature);

/* ------------------------------------------------------------------------------------------------------------ */
//Anime/Manga Endpoints
app.get('/anime', animes.getRecommendedAnimes);
app.get('/manga', mangas.getRecommendedMagas);

/* ------------------------------------------------------------------------------------------------------------ */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of all registered users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of all registered users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uname:
 *                     type: string
 *                     description: The Username
 *                   psw:
 *                     type: string
 *                     description: The user's hashed password
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - psw
 *             properties:
 *               uname:
 *                 type: string
 *                 description: The user name
 *               psw:
 *                 type: string
 *                 description: The Userassword
 *             example:
 *               uname: KuebelUser
 *               psw: Kuebelpassword
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */


//Creating User / Hashing the Password / Save the Password in the Array
app.post('/register', async (req, res) => {
  try {
    //Salt makes every hashed password unique (at the beginn of the encr. passw.)
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.psw, salt)
    const user = { name: req.body.uname, password: hashedPassword }

    const users = getUsersFromUserFile();
    //Check if user already exists
    if (users.find(user => user.name === req.body.uname)) {
      return res.status(400).send('User already exists');
    }
    users.push(user)
    //Add to the users.json file
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

function getUsersFromUserFile() {
  try {
    //Read Users from File/parse them/return them
      const data = fs.readFileSync(userFilePath);
      return JSON.parse(data);
  } catch {
    console.log("Problems with reading User File")
    return []
  }
} 


//Login a particular User and check the User/Password
app.post('/login', async (req, res) => {
  const users = getUsersFromUserFile();
  const user = users.find(user => user.name === req.body.uname)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    //Check if the typed pw is the same like in the database
    if (await bcrypt.compare(req.body.psw, user.password)) {

      //User from the database 
      const username = user.name
      const userPayload = { name: username }
      //Create a Access Token with the secret from .env File and save the username in it
      const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken: accessToken })

    } else {
      res.send('Password is not correct')
    }
  } catch {
    res.status(500).send()
  }
})

//Source for User Login: https://www.youtube.com/watch?v=Ud5xKCYQTjM
//Source for JWT: https://www.youtube.com/watch?v=mbsmsi7l3r4

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']

  //If we have an Auth Header -> return auth header token portion
  let  token = req.cookies.accessToken;
  if(!token) token = authHeader && authHeader.split(' ')[1];
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

app.get('/eso', (req, res) => {
  res.send(esoData)
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

