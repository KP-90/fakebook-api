const mongoose = require('mongoose')
const {DateTime} = require('luxon')
const Comments = require('./Comments')

let Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } };
let user_schema = new Schema({
    first: {type: String, required: true},
    last: {type: String},
    username: {type: String, required: true},
    password: {type: String, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    pending_friends: [{type: Schema.Types.ObjectId, ref: 'User'}],

    date_created: {type: Date, default: Date.now()},
    isAdmin: {type: Boolean, default: false},
}, opts)

user_schema
.virtual('date_readable')
.get(function(){
    return DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATE_MED);
})

user_schema
.virtual('display_name')
.get(function() {
    return this.username.charAt(0).toUpperCase() + this.username.slice(1)
})


module.exports = mongoose.model('User', user_schema)