const express = require('express')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const { render } = require('ejs');
const Schema = mongoose.Schema

const mongoDb = process.env.MONGODB_URI ||'mongodb+srv://vikms:ustdedt8@cluster0.rdr8yn7.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(
  mongoDb,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
const db = mongoose.connection
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

const app = express()
app.set('views', __dirname)
app.set('view engine', 'ejs')

app.use(session(
  {
    secret: 'cats',
    resave: false,
    saveUninitialized: true
  }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => res.render('index'))
app.get('/sign-up-form', (req,res) => res.render('sign-up-form') )
app.post('/sign-up-form', (req,res,next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  }).save(err => {
    if(err) {
      return next(err)
    }
    res.redirect('/')
  })
})

app.listen(3000, () => console.log("App listening on port 3000"))