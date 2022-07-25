const mongoose = require('mongoose')

let Schema = mongoose.Schema

let comment_schema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User"},
    comment: {type: String},
    parentPost: {type: Schema.Types.ObjectId, ref: "Post"},

    date_created: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Comment', comment_schema)