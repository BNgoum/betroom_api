var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchsDuJour = new Schema ({
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
}, {collection: 'matchsdujour'});

module.exports = mongoose.model('MatchsDuJour', MatchsDuJour);
