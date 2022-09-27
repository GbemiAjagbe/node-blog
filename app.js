const path = require('path')
const express = require ('express')
const mongoose = require('mongoose')
const dotenv = require ('dotenv')
const morgan = require ('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const Mongostore = require('connect-mongo')
const connectDB = require('./config/db')
const homepage = require('./routes/homepage')
const auth = require('./routes/auth')
const stories = require('./routes/stories')

//import { login, home, register, products, sales, receipts, suppliers } from './routes';

//load config 
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//logging

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helper
const {formatDate, stripTags, truncate, editIcon} = require('./helpers/hbs')

//Handlebars
app.engine('.hbs', exphbs.engine({helpers:{formatDate, stripTags, truncate, editIcon}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: Mongostore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global var
app.use(function (req,res,next) {
    res.locals.user = req.user || null
    next()
})

// Static folder 
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use(homepage)
app.use(auth)
app.use(stories)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))