const mongoose = require('mongoose')
const { DateTime } = require("luxon");

let Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } };
let post_schema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User"},
    post_contents: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],

    date_created: {type: Date, default: Date.now()}
}, opts)

post_schema
.virtual('date_readable')
.get(function(){
    return DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATETIME_FULL);
})

module.exports = mongoose.model('Post', post_schema)