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
    _id: String,
    championnat: String,
    homeTeam: String,
    awayTeam: String,
    dateHeureMatch: String,
    dateMatch: String,
    heureMatch: String,
    gagnant: String,
    scoreHomeTeam: Number,
    scoreAwayTeam: Number,
    scoreHomeTeamInputUser: Number,
    scoreAwayTeamInputUser: Number,
    statut: String,
    points: Number
})
//

/*
Export
*/
const MatchModel = mongoose.model('match', matchSchema);
module.exports = MatchModel;
//