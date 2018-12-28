/*
Imports
*/
const express = require('express');
const authRouter = express.Router({ mergeParams: true });
const { create } = require('./betroom.controller');
const mongoose = require('mongoose');

// INNER
const { checkFields } = require('../Services/request.checker');
const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../Services/server.response');

//

/*
Routes definition
*/
class AuthRouterClass {
    routes(){
        // User
        authRouter.post('/create', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['name', 'participants', 'stake', 'betsNumber'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            create(req.body)
            .then( apiRes =>  sendApiSuccessResponse(res, 'A new Bet Room is created !', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Error when creating a Bet Room', apiErr) )
        });
    };

    init(){
        this.routes();
        return authRouter;
    }
}
//

/*
Export
*/
module.exports = AuthRouterClass;
//