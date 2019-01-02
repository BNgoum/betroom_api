/*
Import
*/
const BetRoomModel = require('../Models/betroom.model');
const mongoose = require('mongoose');
//

/*
Functions
*/
const create = body => {
    // request to create a bet room
    return new Promise( (resolve, reject) => {
        if (body === '') { reject('Aucune données dans le body (betroom controller).')}

        resolve(BetRoomModel.create({
            _id: mongoose.Types.ObjectId(),
            name: body.name,
            owner: body.owner,
            participants: body.participants,
            reward: body.reward,
            betsNumber: body.betsNumber,
            onGoing: false,
            isBegin: false,
            ranking: null
        }))
    }, (err, success) => {
        if (err) return handleError(err);

        console.log('Success for creating a BR ! : ', success);
    })
}
//

/*
Export
*/
module.exports = {
    create
}
//