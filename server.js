if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

//router
const indexRouter = require('./routes/index')
const bookmarkRouter = require('./routes/bookmark')


//init
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', './layouts/layout')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))


//database
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

async function dbConnection() {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log('DB connected')
}

dbConnection().catch(error => {
    console.error('========error========')
    console.error(error)
    console.error('========error========')
})



app.use('/', indexRouter)
app.use('/bookmark', bookmarkRouter)

app.listen(process.env.PORT || 3000, () =>{
    console.log(`server is running at ${new Date()}`)
})