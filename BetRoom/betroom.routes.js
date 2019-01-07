/*
Imports
*/
const express = require('express');
const BetRoomRouter = express.Router({ mergeParams: true });
const { create, getBetRoom, addOwner, addParticipant, getAllBetRoomOwner, getAllBetRoomParticipant } = require('./betroom.controller');

// INNER
const { checkFields } = require('../Services/request.checker');
const { sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../Services/server.response');
//

/*
Routes definition
*/
class BetRoomRouterClass {
    routes(){
        // Create a new Bet Room
        BetRoomRouter.post('/create', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['name', 'owner', 'participants', 'reward', 'matchs', 'betsNumber'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            create(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'A new Bet Room is created !', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when creating a Bet Room', apiErr) )
        });

        // get a bet room
        BetRoomRouter.post('/getBetRoom', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idBetRoom'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getBetRoom(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'The bet Room : ', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when getting a Bet Room', apiErr) )
        });

        // get all owner bet room
        BetRoomRouter.post('/getAllBetRoomOwner', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['_id'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getAllBetRoomOwner(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'All owner bet rooms : ', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when getting all owner Bet Room', apiErr) )
        });

        // get all owner bet room
        BetRoomRouter.post('/getAllBetRoomParticipant', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['_id'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getAllBetRoomParticipant(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'All participant bet rooms : ', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when getting all participant Bet Room', apiErr) )
        });

        // Add an owner
        BetRoomRouter.put('/put/addOwner', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idOwner', 'betRoom'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            addOwner(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'An owner is now added !', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when adding an owner', apiErr) )
        });

        // Add a participant
        BetRoomRouter.put('/put/addParticipant', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idParticipant', 'betRoom'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            addParticipant(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'A participant is now added ! : ', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when adding a participant : ', apiErr) )
        });
    };

    init(){
        this.routes();
        return BetRoomRouter;
    }
}
//

/*
Export
*/
module.exports = BetRoomRouterClass;
//