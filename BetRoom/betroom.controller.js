/*
Import
*/
const BetRoomModel = require('../Models/betroom.model');
const UserModel = require('../Models/user.model');
const mongoose = require('mongoose');
//

/*
Functions
*/
const create = body => {
    // request to create a bet room
    return new Promise( (resolve, reject) => {
        if (body === '') { reject('Aucune données dans le body (betroom controller).')}

        BetRoomModel.create({
            _id: mongoose.Types.ObjectId(),
            name: body.name,
            owner: body.owner,
            participants: body.participants,
            reward: body.reward,
            matchs: body.matchs,
            betsNumber: body.betsNumber,
            statut: "Pas débuté",
            ranking: null
        }, (err, success) => {
            if (err) return handleError(err);
    
            return resolve(success);
        })
    })
}

const getBetRoom = body => {
    // Request to add an owner
    return new Promise((resolve, reject) => {
        BetRoomModel.findOne({ _id: body.idBetRoom }, (error, success) => {
            if(error){ // Mongo Error
                return reject(error)
            }
            else {
                return resolve(success)
            }
        })
    })
}

const getAllBetRoomOwner = body => {
    // Request to add an owner
    return new Promise((resolve, reject) => {
        UserModel.findOne({ _id: body._id }, (error, success) => {
            if(error){ // Mongo Error
                return reject(error)
            }
            else {
                return resolve(success.bet_room.owner)
            }
        })
    })
}

const getAllBetRoomParticipant = body => {
    // Request to add an owner
    return new Promise((resolve, reject) => {
        UserModel.findOne({ _id: body._id }, (error, success) => {
            if(error){ // Mongo Error
                return reject(error)
            }
            else {
                return resolve(success.bet_room.participant)
            }
        })
    })
}

const addOwner = body => {
    // Request to add an owner
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ _id: body.idOwner }, { $push: { "bet_room.owner": body.betRoom } }, (error, success) => {
            if(error){ // Mongo Error
                return reject(error)
            }
            else {
                return resolve(success)
            }
        })
    })
}

const addParticipant = body => {
    // Request to add an owner
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ _id: body.idParticipant }, { $push: { "bet_room.participant": body.betRoom } }, (error, success) => {
            if(error){ // Mongo Error
                return reject(error)
            }
            else {
                return resolve(success)
            }
        })
    })
}

const setTeamScore = body => {
    // Request to set score
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: body._id } , (error, success) => {
            if(error) { // Mongo Error
                return reject(error)
            }
            else {
                if ( body.typeParticipant === "owner" ) {
                    success.bet_room.owner.map(betroom => {      
                        if ( betroom._id === body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id === body.idMatch) {
                                    match.scoreHomeTeamInputUser = parseInt(body.scoreHomeTeam);
                                    match.scoreAwayTeamInputUser = parseInt(body.scoreAwayTeam);
                                }
                            })
                        }
                    })
                } else {
                    success.bet_room.participant.map(betroom => {      
                        if ( betroom._id === body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id === body.idMatch) {
                                    match.scoreHomeTeamInputUser = parseInt(body.scoreHomeTeam);
                                    match.scoreAwayTeamInputUser = parseInt(body.scoreAwayTeam);
                                }
                            })
                        }
                    })
                }

                UserModel.findById({ _id: body._id }, (err, user) => {
                    if(err) { // Mongo Error
                        return reject(err)
                    }

                    user.set({ bet_room: success.bet_room });
                    user.save(function (err, updatedUser) {
                        if (err) return handleError(err);
                        return resolve(updatedUser)
                    });
                })
            }
        })
        
    })
}

const updateMatch = body => {
    // Request to set score in input user field
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: body._id } , (error, success) => {
            if(error) { // Mongo Error
                return reject(error)
            }
            else {
                if ( body.typeParticipant === "owner" ) {
                    success.bet_room.owner.map(betroom => {      
                        if ( betroom._id === body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id === body.idMatch) {
                                    match.scoreHomeTeamInputUser = parseInt(body.scoreHomeTeam);
                                    match.scoreAwayTeamInputUser = parseInt(body.scoreAwayTeam);
                                }
                            })
                        }
                    })
                } else {
                    success.bet_room.participant.map(betroom => {      
                        if ( betroom._id === body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id === body.idMatch) {
                                    match.scoreHomeTeamInputUser = parseInt(body.scoreHomeTeam);
                                    match.scoreAwayTeamInputUser = parseInt(body.scoreAwayTeam);
                                }
                            })
                        }
                    })
                }

                UserModel.findById({ _id: body._id }, (err, user) => {
                    if(err) { // Mongo Error
                        return reject(err)
                    }

                    user.set({ bet_room: success.bet_room });
                    user.save(function (err, updatedUser) {
                        if (err) return handleError(err);
                        return resolve(updatedUser)
                    });
                })
            }
        })
    })
}

const updateScoreMatch = body => {
    // Request to set score real
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: body._id } , (error, success) => {
            if(error) { // Mongo Error
                return reject(error)
            }
            else {
                if ( body.typeParticipant === "owner" ) {
                    success.bet_room.owner.map(betroom => {     
                        if ( betroom._id == body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id == body.idMatch) {
                                    if (body.scoreHomeTeam == null) {
                                        match.scoreHomeTeam = 0;
                                        match.scoreAwayTeam = 0;
                                    } else {
                                        match.scoreHomeTeam = body.scoreHomeTeam;
                                        match.scoreAwayTeam = body.scoreAwayTeam;
                                    }
                                    match.statut = body.status;
                                    match.gagnant = body.gagnant;

                                    UserModel.findByIdAndUpdate({ _id: body._id },{ bet_room: success.bet_room }, (err, user) => {
                                        if(err) { // Mongo Error
                                            return reject(err)
                                        }
                    
                                        if(user) {
                                            resolve(success.bet_room)
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    success.bet_room.participant.map(betroom => {      
                        if ( betroom._id == body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id == body.idMatch) {
                                    if (body.scoreHomeTeam == null) {
                                        match.scoreHomeTeam = 0;
                                        match.scoreAwayTeam = 0;
                                    } else {
                                        match.scoreHomeTeam = body.scoreHomeTeam;
                                        match.scoreAwayTeam = body.scoreAwayTeam;
                                    }
                                    match.statut = body.status;
                                    match.gagnant = body.gagnant;

                                    UserModel.findByIdAndUpdate({ _id: body._id },{ bet_room: success.bet_room }, (err, user) => {
                                        if(err) { // Mongo Error
                                            return reject(err)
                                        }
                    
                                        if(user) {
                                            resolve(success.bet_room)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}

const updatePoints = body => {
    // Request to set score real
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: body._id } , (error, success) => {
            if(error) { // Mongo Error
                return reject(error)
            }
            else {
                if ( body.typeParticipant === "owner" ) {
                    success.bet_room.owner.map(betroom => {     
                        if ( betroom._id == body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id == body.idMatch) {
                                    match.points = body.points;

                                    UserModel.findByIdAndUpdate({ _id: body._id },{ bet_room: success.bet_room }, (err, user) => {
                                        if(err) { // Mongo Error
                                            return reject(err)
                                        }
                    
                                        if(user) { resolve(success.bet_room) }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    success.bet_room.participant.map(betroom => {      
                        if ( betroom._id == body.idBetRoom ) {
                            betroom.matchs.map(match => {
                                if ( match._id == body.idMatch) {
                                    match.points = body.points;

                                    UserModel.findByIdAndUpdate({ _id: body._id },{ bet_room: success.bet_room }, (err, user) => {
                                        if(err) { // Mongo Error
                                            return reject(err)
                                        }
                    
                                        if(user) { resolve(success.bet_room) }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}
//

/*
Export
*/
module.exports = {
    create,
    getBetRoom,
    addOwner,
    addParticipant,
    getAllBetRoomOwner,
    getAllBetRoomParticipant,
    setTeamScore,
    updateMatch,
    updateScoreMatch,
    updatePoints
}
//