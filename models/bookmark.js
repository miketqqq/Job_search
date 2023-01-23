const mongoose = require('mongoose')

const bookmarkSchema = mongoose.Schema({
    title:{
        type: String,
    },
    link:{
        type: String,
        require: true
    },
    company_name:{
        type: String,
    },
    description:{
        type: String,
    },
    post_time:{
        type: String,
    },
    bookmark_time:{
        type: Date,
        default: Date.now
    },
    is_active:{
        type: Boolean,
        default: true
    },
    remark:{
        type: String,
    },
})


module.exports = mongoose.model('Bookmark', bookmarkSchema)

