const mongoose = require('mongoose')

let Schema = mongoose.Schema

let post_schema = new Schema({
    author: {type: Schema.Types.ObjectId},
    post_contents: {type: String},
    likes: {type: Array, default: []},

    date_created: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Post', post_schema)