const mongoose = require('mongoose')

const historySchema = mongoose.Schema({
    query_title:{
        type: String,
    },
    query_time:{
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('History', historySchema)

