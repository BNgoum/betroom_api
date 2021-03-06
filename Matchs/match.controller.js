/*
Import
*/
const mongoose = require('mongoose');
const db = mongoose.connection;
const MatchModel = require('../Models/match.model');
const collectionMatch = db.collection('matches');
const moment = require('moment');
moment.locale('fr');
const fetch = require("node-fetch");
const axios = require('axios');
//

const apiHeaders = { 'X-Auth-Token': '74a86b94a67541189f94e8266901f6e4' }
const championnats = {
    "Ligue 1": 2015,
    "Premier League": 2021,
    "Bundesliga": 2002,
    "Serie A": 2019,
    "La Liga": 2014,
    "Ligue des Champions": 2001
}

/*
Functions
*/
// Fonction de tri récupérer sur StackOverflow 
sortByDateAsc = function (lhs, rhs) {
    return lhs > rhs ? 1 : lhs < rhs ? -1 : 0;
}

// const fetchMatchs = body => {
//     // Search for user
//     return new Promise( (resolve, reject) => {

//         // On supprime les tous les documents de la collection matchs de la semaine
//         collectionMatch.deleteMany({}, (error) => {
//             if(error){ // Mongo Error
//                 return reject(error)
//             } else {
//                 for (const i in championnats) {
//                     if (championnats.hasOwnProperty(i)) {
//                         const championnat = championnats[i];
                        
//                         fetch('https://api.football-data.org/v2/competitions/' + championnat + '/matches?dateFrom=' + body.dateFrom + '&dateTo=' + body.dateTo, {
//                             headers: apiHeaders
//                         })
//                         .then(response => {
//                             return response.json();
//                         })
//                         .then(data => {
//                             data.matches.forEach(function(match) {
//                                 let scoreHT = 0;
//                                 let scoreAT = 0;
//                                 if (match.score.fullTime.homeTeam !== null) {
//                                     scoreHT = match.score.fullTime.homeTeam;
//                                     scoreAT = match.score.fullTime.awayTeam;
//                                 }

//                                 let newMatch = new MatchModel({
//                                     _id: match.id,
//                                     championnat: i,
//                                     homeTeam: match.homeTeam.name,
//                                     awayTeam: match.awayTeam.name,
//                                     dateHeureMatch: match.utcDate,
//                                     dateMatch: moment(match.utcDate).format('DD-MM-YYYY'),
//                                     heureMatch: moment(match.utcDate).format('HH:mm:ss'),
//                                     gagnant: match.score.winner,
//                                     scoreHomeTeam: scoreHT,
//                                     scoreAwayTeam: scoreAT,
//                                     scoreHomeTeamInputUser: 0,
//                                     scoreAwayTeamInputUser: 0,
//                                     statut: match.status,
//                                     points: 0
//                                 })
        
//                                 // Save match
//                                 MatchModel.create(newMatch, (error, newMatch) => {
//                                     if(error){ // Mongo error
//                                         return reject(error)
//                                     }
//                                     else{ // Match registrated
//                                         return resolve(newMatch);
//                                     };
//                                 });
//                             })
//                         })
//                         .catch( error => {
//                             console.log('Erreur lors de l\'ajout des matchs (match.controller) : ', error)
//                             return reject(error);
//                         });
//                     }
//                 }
//             }
//         });
//     });
// };

const getMatchs = id => {
    return new Promise( (resolve, reject ) => {
        MatchModel.find({ championnat: id}, (error, matchs) => {
            //console.log('Matchs : ', matchs)
        
            if(error) reject(error)
            else if( !matchs ) reject('Championnat not found')
            else {
                return resolve({matchs: matchs});
            }
        })
        
    })
};

const getAllMatchs = () => {
    return new Promise( (resolve, reject ) => {
        MatchModel.find({}, (error, matchs) => {
            //console.log('Matchs : ', matchs)
        
            if(error) reject(error)
            else if( !matchs ) reject('Championnat not found')
            else {
                return resolve({matchs: matchs});
            }
        })
        
    })
};

const getAllMatchsPending = () => {
    return new Promise( (resolve, reject ) => {
        MatchModel.find({}, (error, matchs) => {
            if(error) reject(error)
            else if( !matchs ) reject('Championnat not found')
            else {
                let matchsPending = {
                    "SerieA": [],
                    "PrimeraDivision": [],
                    "Ligue1": [],
                    "Bundesliga": [],
                    "UEFAChampionsLeague": [],
                    "PremierLeague": [],
                }

                matchs.map(match => {
                    if (match.statut === "SCHEDULED" || match.statut === "IN_PLAY" || match.statut === "LIVE") {
                        switch (match.championnat) {
                            case 'Serie A':
                                matchsPending.SerieA.push(match);
                                break;
                            case 'Primera Division':
                                matchsPending.PrimeraDivision.push(match);
                                break;
                            case 'Ligue 1':
                                matchsPending.Ligue1.push(match);
                                break;
                            case 'Bundesliga':
                                matchsPending.Bundesliga.push(match);
                                break;
                            case 'UEFA Champions League':
                                matchsPending.UEFAChampionsLeague.push(match);
                                break;
                            case 'Premier League':
                                matchsPending.PremierLeague.push(match);
                                break;
                        }
                       
                    }
                })

                // Trie des matchs dans l'ordre croissant
                for (var i in matchsPending) {
                    // skip loop if the property is from prototype
                    if (!matchsPending.hasOwnProperty(i)) continue;

                    matchsPending[i].sort(function(a,b) {
                        return new Date(a.dateHeureMatch) - new Date(b.dateHeureMatch);
                    });
                }

                return resolve({matchs: matchsPending});
            }
        })
    })
};

const getMatch = id => {
    return new Promise( (resolve, reject ) => {
        resolve(fetch('https://api.football-data.org/v2/matches/' + id, {
            headers: apiHeaders
        }))
    })
    .then(response => { return response.json() })
    .then( data => { return data.match })
    .catch(err => {
        console.log('Erreur lors de la tentative de la récupération des infos d\'un match : ', err);
    });
};

/*
Export
*/
module.exports = {
    getMatchs,
    getMatch,
    getAllMatchs,
    getAllMatchsPending
}
//