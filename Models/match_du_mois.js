var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchsDuMois = new Schema ({
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
}, {collection: 'matchsdumois'});

module.exports = mongoose.model('MatchsDuMois', MatchsDuMois);
