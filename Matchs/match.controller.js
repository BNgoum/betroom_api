/*
Import
*/
const mongoose = require('mongoose');
const db = mongoose.connection;
const MatchModel = require('../Models/match.model');
const collectionMatch = db.collection('matches');
const moment = require('moment');
const fetch = require("node-fetch");
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

const fetchMatchs = body => {
    // Search for user
    return new Promise( (resolve, reject) => {

        // On supprime les tous les documents de la collection matchs de la semaine
        collectionMatch.deleteMany({}, (error) => {
            if(error){ // Mongo Error
                return reject(error)
            } else {
                for (const i in championnats) {
                    if (championnats.hasOwnProperty(i)) {
                        const championnat = championnats[i];
                        
                        fetch('https://api.football-data.org/v2/competitions/' + championnat + '/matches?dateFrom=' + body.dateFrom + '&dateTo=' + body.dateTo, {
                            headers: apiHeaders
                        })
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            data.matches.forEach(function(element) {
                                let match = new MatchModel({
                                    _id: mongoose.Types.ObjectId(),
                                    championnat: i,
                                    homeTeam: element.homeTeam.name,
                                    awayTeam: element.awayTeam.name,
                                    dateHeureMatch: element.utcDate,
                                    dateMatch: moment(element.utcDate).format('DD-MM-YYYY'),
                                    heureMatch: moment(element.utcDate).format('HH:mm:ss'),
                                    gagnant: element.score.winner,
                                    scoreHomeTeam: element.score.fullTime.homeTeam,
                                    scoreAwayTeam: element.score.fullTime.awayTeam
                                })
        
                                // Save match
                                MatchModel.create(match, (error, newMatch) => {
                                    if(error){ // Mongo error
                                        return reject(error)
                                    }
                                    else{ // Match registrated
                                        return resolve(newMatch);
                                    };
                                });
                            })
                        })
                        .catch( error => {
                            console.log('Erreur lors de l\'ajout des matchs (match.controller) : ', error)
                            return reject(error);
                        });
                    }
                }
            }
        });
    });
};

const getMatchs = body => {
    return new Promise( (resolve, reject ) => {

        MatchModel.find( { championnat : body.championnat }, (error, matchs) => {
            if(error) reject(error)
            else if( !matchs ) reject('Championnat not found')
            else {
                let momentDates = [];
                let arrayMatchsSort = [];

                for (let i in matchs) {
                    momentDates.push(moment(matchs[i].dateHeureMatch));
                }

                momentDates.sort(sortByDateAsc);

                for (let ite in momentDates) {
                    for (let a in matchs) {
                        let concatDateHeureMatch = matchs[a].dateMatch + ' ' + matchs[a].heureMatch;
                        if (momentDates[ite].format('DD-MM-YYYY HH:mm:ss') == concatDateHeureMatch && !arrayMatchsSort.includes(matchs[a])) {
                            arrayMatchsSort.push(matchs[a]);
                        }
                    }
                }

                resolve({
                    matchs: arrayMatchsSort
                })
            }
        })
    })
};

/*
Export
*/
module.exports = {
    fetchMatchs,
    getMatchs
}
//