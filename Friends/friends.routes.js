/*
Imports
*/
const express = require('express');
const friendsRouter = express.Router({ mergeParams: true });
const { request, accepted, getFriends } = require('./friends.controller');
const mongoose = require('mongoose');

// INNER
const { checkFields } = require('../Services/request.checker');
const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../Services/server.response');

//

/*
Routes definition
*/
class FriendsRouterClass {
    routes(){
        // Request Friends
        friendsRouter.post('/request', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idUserA', 'idUserB'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            request(req.body)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Friends request OK ', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Friends request NOT OK ', apiErr) )
        });

        // Response friends
        friendsRouter.post('/accepted', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idUserA', 'idUserB'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            accepted(req.body)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Friend accepted', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Friend not accepted', apiErr) )
        });

        // Get friends
        friendsRouter.post('/allFriends', (req, res) => {
            // Check for mandatories
            const { miss, extra, ok } = checkFields(['idUser'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getFriends(req.body)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Friend accepted', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Friend not accepted', apiErr) )
        });
    };

    

    init(){
        this.routes();
        return friendsRouter;
    }
}
//

/*
Export
*/
module.exports = FriendsRouterClass;
//