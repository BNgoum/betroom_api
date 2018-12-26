/*
Imports & configs
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//

/*
Model definition
*/
const matchSchema = new Schema({
    _id: Schema.ObjectId,
    championnat: String,
    homeTeam: String,
    awayTeam: String,
    dateHeureMatch: String,
    dateMatch: String,
    heureMatch: String,
    gagnant: String,
    scoreHomeTeam: Number,
    scoreAwayTeam: Number,
})
//

/*
Export
*/
const MatchModel = mongoose.model('match', matchSchema);
module.exports = MatchModel;
//