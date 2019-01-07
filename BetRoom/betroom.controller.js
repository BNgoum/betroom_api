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
    getAllBetRoomParticipant
}
//