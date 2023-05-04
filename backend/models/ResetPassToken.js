const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const resetPassToken = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    token: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        expires: 10000,
        default: Date.now(),
    },
})

resetPassToken.methods.compareToken = async function(token) {
    const result = await bcrypt.compareSync(token, this.token)
    return result
}


module.exports = mongoose.model('resetPassToken', resetPassToken)