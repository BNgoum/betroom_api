/*
Imports
*/
const express = require('express');
const matchRouter = express.Router({ mergeParams: true });
const { fetchMatchs, getMatchs } = require('./match.controller');
const mongoose = require('mongoose');

// INNER
const { checkFields } = require('../Services/request.checker');
const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../Services/server.response');

const db = mongoose.connection;
let collectionMatch = db.collection('matchs');
//

/*
Routes definition
*/
class MatchRouterClass {
    routes(){
        // HATEOAS
        matchRouter.get('/', (req, res) => {
            res.json('HATEOAS for matchs.');
        });
        
        // fetchMatchs
        matchRouter.post('/matchs', (req, res) => {

            // Check for mandatories
            const { miss, extra, ok } = checkFields(['dateFrom', 'dateTo'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            fetchMatchs(req.body)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Matchs add', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Matchs error add', apiErr) )
        });

        // Get Match of championnats
        matchRouter.post('/matchsChampionnat', (req, res) => {

            // Check for mandatories
            const { miss, extra, ok } = checkFields(['championnat'], req.body);

            // Check oppropriated values
            if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getMatchs(req.body)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Matchs of championnat find', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Matchs of championnat not find', apiErr) )
        });
    };

    init(){
        this.routes();
        return matchRouter;
    }
}
//

/*
Export
*/
module.exports = MatchRouterClass;
//