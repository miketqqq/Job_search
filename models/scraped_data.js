const mongoose = require('mongoose')

const scrapedDataSchema = mongoose.Schema({
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


scrapedDataSchema.pre('insertMany', async function(next, docs){
    let deleted = await this.deleteMany({})
    console.log(`deleted ${deleted.deletedCount} of old documents`)
    return next()
})

module.exports = mongoose.model('ScrapedData', scrapedDataSchema)


// delete after 1 hour
