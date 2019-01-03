/*
Imports
*/
const express = require('express');
const BetRoomRouter = express.Router({ mergeParams: true });
const { create, getBetRoom, addOwner, addParticipant } = require('./betroom.controller');

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
        BetRoomRouter.get('/getBetRoom', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idBetRoom'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getBetRoom(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'The bet Room : ', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when getting a Bet Room', apiErr) )
        });

        // Add an owner
        BetRoomRouter.put('/put/addOwner', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idOwner', 'idBetRoom'], req.body);

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
            const { miss, extra, ok } = checkFields(['idParticipant', 'idBetRoom'], req.body);

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