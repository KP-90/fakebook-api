const mongoose = require('mongoose')
const {DateTime} = require('luxon')

let Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } };

let comment_schema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User"},
    comment: {type: String},
    parentPost: {type: Schema.Types.ObjectId, ref: "Post"},

    date_created: {type: Date, default: Date.now()},
}, opts)    

comment_schema
.virtual('date_readable')
.get(function(){
    return DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATETIME_FULL);
})

module.exports = mongoose.model('Comment', comment_schema)