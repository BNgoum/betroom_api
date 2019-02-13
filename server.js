const express = require('express');
require('dotenv').config();
const port = process.env.PORT;
const moment = require('moment');
const fetch = require("node-fetch");

// Import des routes
const AuthRouterClass = require('./Auth/auth.routes');
const MatchRouterClass = require('./Matchs/match.routes');
const FriendsRouterClass = require('./Friends/friends.routes');
const BetRoomRouterClass = require('./BetRoom/betroom.routes');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// URL de connexion à la bdd mLab
const dbuser = "root";
const dbpassword = "betroom123";
const urlmongo = "mongodb://" + dbuser + ":" + dbpassword + "@ds013569.mlab.com:13569/betroom";

// Connexion entre l'API et la BDD
mongoose.connect(urlmongo, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function() {
    console.log('Connexion à la BDD OK.');
})
const collectionMatch = db.collection('matches');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRouter = new AuthRouterClass();
const matchRouter = new MatchRouterClass();
const friendsRouter = new FriendsRouterClass();
const betRoomRouter = new BetRoomRouterClass();

app.use('/api/match', matchRouter.init());
app.use('/api/auth', authRouter.init());
app.use('/api/friends', friendsRouter.init());
app.use('/api/betroom', betRoomRouter.init());

const apiHeaders = { 'X-Auth-Token': '74a86b94a67541189f94e8266901f6e4' }
const championnats = ["2015", "2021", "2002", "2019", "2014", "2001"];
const now = moment().format('YYYY-MM-DD');
const nextWeek = moment().add(7, 'd').format('YYYY-MM-DD');
const MatchModel = require('./Models/match.model');

updateMatches = () => {
    fetch('https://api.football-data.org/v2/matches?competitions=' + championnats + '&dateFrom=' + now + '&dateTo=' + nextWeek, {
        headers: apiHeaders
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.matches.forEach((match) => {
            let scoreHT, scoreAT = 0;

            if (match.score.fullTime.homeTeam !== null) {
                scoreHT = match.score.fullTime.homeTeam;
                scoreAT = match.score.fullTime.awayTeam;
            }

            let update = {
                _id: match.id,
                championnat: match.competition.name,
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                dateHeureMatch: match.utcDate,
                dateMatch: moment(match.utcDate).format('DD-MM-YYYY'),
                heureMatch: moment(match.utcDate).format('HH:mm'),
                gagnant: match.score.winner,
                scoreHomeTeam: scoreHT,
                scoreAwayTeam: scoreAT,
                statut: match.status,
            }
            
            MatchModel.findOneAndUpdate({_id: match.id}, update, { upsert: true }, (error, result) => {
                if (!error) {
                    if (!result) {
                        result = new MatchModel({
                            _id: match.id,
                            championnat: match.competition.name,
                            homeTeam: match.homeTeam.name,
                            awayTeam: match.awayTeam.name,
                            dateHeureMatch: match.utcDate,
                            dateMatch: moment(match.utcDate).format('DD-MM-YYYY'),
                            heureMatch: moment(match.utcDate).format('HH:mm'),
                            gagnant: match.score.winner,
                            scoreHomeTeam: scoreHT,
                            scoreAwayTeam: scoreAT,
                            statut: match.status,
                        })
                    }
                    // Save the document
                    result.save(function(error) {
                        if (!error) {
                            // Do something with the document
                        } else {
                            throw error;
                        }
                    });
                }
            })
        })
    })
    .catch( error => {
        console.log('Erreur lors de l\'ajout des matchs (server.js) : ', error)
        return reject(error);
    });
}        

// updateMatches = () => {
//     return new Promise((resolve, reject) => {
//         collectionMatch.deleteMany({}, (error) => {
//             if(error){ // Mongo Error
//                 return reject(error)
//             } else {
//                 fetch('https://api.football-data.org/v2/matches?competitions=' + championnats + '&dateFrom=' + now + '&dateTo=' + nextWeek, {
//                     headers: apiHeaders
//                 })
//                 .then(response => {
//                     return response.json();
//                 })
//                 .then(data => {
//                     data.matches.forEach(function(match) {
//                         let scoreHT = 0;
//                         let scoreAT = 0;
//                         if (match.score.fullTime.homeTeam !== null) {
//                             scoreHT = match.score.fullTime.homeTeam;
//                             scoreAT = match.score.fullTime.awayTeam;
//                         }

//                         let newMatch = new MatchModel({
//                             _id: match.id,
//                             championnat: match.competition.name,
//                             homeTeam: match.homeTeam.name,
//                             awayTeam: match.awayTeam.name,
//                             dateHeureMatch: match.utcDate,
//                             dateMatch: moment(match.utcDate).format('DD-MM-YYYY'),
//                             heureMatch: moment(match.utcDate).format('HH:mm'),
//                             gagnant: match.score.winner,
//                             scoreHomeTeam: scoreHT,
//                             scoreAwayTeam: scoreAT,
//                             scoreHomeTeamInputUser: 0,
//                             scoreAwayTeamInputUser: 0,
//                             statut: match.status,
//                             points: 0
//                         })

//                         // Save match
//                         MatchModel.create(newMatch, (error, newMatch) => {
//                             if(error){ // Mongo error
//                                 return reject(error)
//                             }
//                             else{ // Match registrated
//                                 return resolve(newMatch);
//                             };
//                         });
//                     })
//                 })
//                 .catch( error => {
//                     console.log('Erreur lors de l\'ajout des matchs (server.js) : ', error)
//                     return reject(error);
//                 });
//             }
//         })
//     })
// }

setInterval(updateMatches, 30000);

app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`);
})