/*
Imports & configs
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
//


/*
Model definition
*/
const userSchema = new Schema({
    pseudo: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    friends: {
        accepted: [{ type: Schema.Types.ObjectId }],
        pending: [{ type: Schema.Types.ObjectId }],
        recipient: [{ type: Schema.Types.ObjectId }]
    },
    bet_room: {
        owner: [{ type: Object }],
        participant: [{ type: Object }]
    },
    lastCallApi: {
        type: Date,
        default: Date.now
    },
    totalPoints: { type: Number, default: 0 }
})
//

/*
Method
*/
userSchema.methods.generateJwt = function generateJwt(){
    // set expiration
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 59);

    // JWT creation
    return jwt.sign({
        _id: this._id,
        email: this.email,
        password: this.password,
        expireIn: '10s',
        exp: parseInt(expiry.getTime() / 100, 10)
    }, process.env.JWT_SECRET )
};
//

/*
Export
*/
const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
//