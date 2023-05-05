const express = require('express')
const path = require('path')



const app = express()
let list = require('./data.js')


app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/api/list', (req, res) => {
    let start = Math.floor(Math.random() * 2)
    res.json(list.slice(start, start + 2))
})
app.listen(3000, () => {
    console.log('pwa server port:3000');
})