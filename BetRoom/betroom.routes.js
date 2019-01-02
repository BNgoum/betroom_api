/*
Imports
*/
const express = require('express');
const BetRoomRouter = express.Router({ mergeParams: true });
const { create } = require('./betroom.controller');

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
            const { miss, extra, ok } = checkFields(['name', 'owner', 'participants', 'reward', 'betsNumber'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            create(req.body)
            .then( apiRes => sendApiSuccessResponse(res, 'A new Bet Room is created !', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when creating a Bet Room', apiErr) )
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