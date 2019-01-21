/*
Imports
*/
const express = require('express');
const matchRouter = express.Router({ mergeParams: true });
const { getMatchs, getMatch, getAllMatchs } = require('./match.controller');
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
        // matchRouter.post('/matchs', (req, res) => {

        //     // Check for mandatories
        //     const { miss, extra, ok } = checkFields(['dateFrom', 'dateTo'], req.body);

        //     // Check oppropriated values
        //     if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

        //     // Use controller function
        //     fetchMatchs(req.body)
        //     .then( apiRes =>  sendApiSuccessResponse(res, 'Matchs add', apiRes) )
        //     .catch( apiErr => sendApiErrorResponse(res, 'Matchs error add', apiErr) )
        // });

        // Get Match of championnats
        matchRouter.get('/matchsChampionnat/:id', (req, res) => {

            // Check for mandatories
            //const { miss, extra, ok } = checkFields(['championnat'], req.body);

            // Check oppropriated values
            //if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getMatchs(req.params.id)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Matchs of championnat find', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Matchs of championnat not find', apiErr) )
        });
        
        // Get all matchs of championnats
        matchRouter.get('/matchs', (req, res) => {

            // Check for mandatories
            //const { miss, extra, ok } = checkFields(['championnat'], req.body);

            // Check oppropriated values
            //if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getAllMatchs()
            .then( apiRes =>  sendApiSuccessResponse(res, 'Matchs of championnat find', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Matchs of championnat not find', apiErr) )
        });

        // Get one match
        matchRouter.get('/match/:id', (req, res) => {

            // Check for mandatories
            // const { miss, extra, ok } = checkFields(['_id'], req.body);

            // Check oppropriated values
            // if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

            // Use controller function
            getMatch(req.params.id)
            .then( apiRes =>  sendApiSuccessResponse(res, 'Match find', apiRes) )
            .catch( apiErr => sendApiErrorResponse(res, 'Match not find', apiErr) )
        });

        // Get a list of matches between interval and competitions
        // matchRouter.get('/matchesIntervalCompetitions', (req, res) => {
        //     // // Check for mandatories
        //     // const { miss, extra, ok } = checkFields(['competitions', 'dateFrom', 'dateTo'], req.body);

        //     // // Check oppropriated values
        //     // if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

        //     // Use controller function
        //     getMatchesBetweenIntervalAndCompetitions(req.query.competitions, req.query.dateFrom,req.query.dateTo)
        //     .then( apiRes =>  sendApiSuccessResponse(res, 'List of matches between interval and competitions : ', apiRes) )
        //     .catch( apiErr => sendApiErrorResponse(res, 'Error when get List of matches between interval and competitions : ', apiErr) )
        // });
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