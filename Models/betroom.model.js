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
    reward: String,
    matchs: [],
    statut: String,
    betsNumber: Number,
    ranking: { type: Schema.Types.ObjectId },
    winner: { Type:String, default: ""},
    totalPoints: { Type: Number, default: 0 }
})
//

/*
Export
*/
const BetRoomModel = mongoose.model('betroom', betRoomSchema);
module.exports = BetRoomModel;
//