if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passportConfig')

initializePassport(passport, email => { 
    return users.find(user => user.email == email) }
)

const users = []        // every time server reloads, users array would reset to empty array --> do not use this in production

app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))      // allow data in login/register form html tags to be used for req in post methods
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})


app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.listen(3000)

// req.body.____ ==> name='____' (html name tag)