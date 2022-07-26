const mongoose = require('mongoose')
const {DateTime} = require('luxon')

let Schema = mongoose.Schema

let user_schema = new Schema({
    first: {type: String, required: true},
    last: {type: String},
    username: {type: String, required: true},
    password: {type: String, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    pending_friends: [{type: Schema.Types.ObjectId, ref: 'User'}],

    date_created: {type: Date, default: Date.now()},
    date_readable: {type: String, default: (DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATETIME_FULL))}
})

module.exports = mongoose.model('User', user_schema)