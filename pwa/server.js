const express = require('express')
const path = require('path')
const webpush = require('web-push')
const bodyParser = require('body-parser')

const vapidKeys = {
    publicKey: 'BPDMx_mGRXxnfZaZ74xHGI7xtt5u92wUVkJz8RdGiM8yQBj1MLGdTrFyJOMztlKRtBcNpKk1pNoXUiUupyMwoAM',
    privateKey: 'DF_8cc5CujxRic8fy0Du4afjXwbCdqSwX_R6fwNEaXA'
}
const app = express()
let list = require('./data.js')
const subs = []
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/api/list', (req, res) => {
    let start = Math.floor(Math.random() * 2)
    res.json(list.slice(start, start + 2))
})
app.post('/add-sub', (req, res) => {
    subs.push(req.body)
    res.json({ data: 'ok' })
})
app.get('/server-push', (req, res) => {
    console.log(subs);
    subs.forEach(sub => webpush.sendNotification(sub, JSON.stringify('hello zf')))
    res.json({ data: 'ok' })
})
app.listen(3000, () => {
    console.log('pwa server port:3000');
})