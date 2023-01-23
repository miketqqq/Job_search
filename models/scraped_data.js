const mongoose = require('mongoose')

const scrapedData = mongoose.Schema({
    index:{
        type: Number,
    },
    source:{
        type: String,
    },
    title:{
        type: String,
    },
    link:{
        type: String,
    },
    company_name:{
        type: String,
    },
    description:{
        type: String,
    },
    post_time:{
        type: String,
    }
})


module.exports = mongoose.model('ScrapedData', scrapedData)


// delete after 1 hour
