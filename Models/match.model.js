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
    scoreHomeTeam: {type: Number, default: 0},
    scoreAwayTeam: {type: Number, default: 0},
    scoreHomeTeamInputUser: {type: Number, default: 0},
    scoreAwayTeamInputUser: {type: Number, default: 0},
    statut: String,
    points: {type: Number, default: 0}
})
//

/*
Export
*/
const MatchModel = mongoose.model('match', matchSchema);
module.exports = MatchModel;
//