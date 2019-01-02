/*
Imports & configs
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//

/*
Model definition
*/
const betRoomSchema = new Schema({
    _id: Schema.ObjectId,
    name: String,
    owner: { type: Schema.Types.ObjectId },
    participants: [{ type: Schema.Types.ObjectId }],
    stake: String,
    onGoing: Boolean,
    isBegin: Boolean,
    betsNumber: Number,
    ranking: { type: Schema.Types.ObjectId },
})
//

/*
Export
*/
const BetRoomModel = mongoose.model('betroom', betRoomSchema);
module.exports = BetRoomModel;
//