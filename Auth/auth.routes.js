/*
Imports
*/
    const express = require('express');
    const authRouter = express.Router({ mergeParams: true });
    const { register, login, getUser, getUserById, getUserByPseudo } = require('./auth.controller');
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
            authRouter.post('/user', (req, res) => {
                // Check for mandatories
                const { miss, extra, ok } = checkFields(['email'], req.body);

                // Check oppropriated values
                if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

                // Use controller function
                getUser(req.body)
                .then( apiRes =>  sendApiSuccessResponse(res, 'User information find by email', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'User information not exist by email', apiErr) )
            });

            // User By id
            authRouter.post('/userId', (req, res) => {
                // Check for mandatories
                const { miss, extra, ok } = checkFields(['id'], req.body);

                // Check oppropriated values
                if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

                // Use controller function
                getUserById(req.body)
                .then( apiRes =>  sendApiSuccessResponse(res, 'User information find by id', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'User information not exist by id', apiErr) )
            });

            // User By pseudo
            authRouter.post('/userPseudo', (req, res) => {
                // Check for mandatories
                const { miss, extra, ok } = checkFields(['pseudo'], req.body);

                // Check oppropriated values
                if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

                // Use controller function
                getUserByPseudo(req.body)
                .then( apiRes =>  sendApiSuccessResponse(res, 'User information find by pseudo', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'User information not exist by pseudo', apiErr) )
            });
            
            // Register
            authRouter.post('/register', (req, res) => {

                // Check for mandatories
                const { miss, extra, ok } = checkFields(['pseudo', 'first_name', 'last_name', 'email', 'password'], req.body);

                // Check oppropriated values
                if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

                // Use controller function
                register(req.body)
                .then( apiRes =>  sendApiSuccessResponse(res, 'User register', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'User already exist', apiErr) )
            });

            // Login
            authRouter.post('/login', (req, res) => {

                // Check for mandatories
                const { miss, extra, ok } = checkFields(['email', 'password'], req.body);

                // Check oppropriated values
                if( !ok ){ sendFieldsError( res, 'Bad fields provided', miss, extra ) }

                // Use controller function
                login(req.body)
                .then( apiRes =>  sendApiSuccessResponse(res, 'User login', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'User not login', apiErr) )
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