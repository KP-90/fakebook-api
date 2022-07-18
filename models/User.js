const mongoose = require('mongoose')

let Schema = mongoose.Schema

let user_schema = new Schema({
    first: {type: String, required: true},
    last: {type: String},
    username: {type: String, required: true},
    password: {type: String, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    pending_friends: [{type: Schema.Types.ObjectId, ref: 'User'}],

    date_created: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('User', user_schema)