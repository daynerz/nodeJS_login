const express = require('express')
const res = require('express/lib/response')
const app = express()

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Dana' })
})

app.get('/login', (req, res) =>{
    res.render('login.ejs')
})

app.get('/register', (req, res) =>{
    res.render('register.ejs')
})

app.listen(3000)