/*
Import
*/
    const UserModel = require('../Models/user.model');
    const bcrypt = require('bcryptjs');
//

/*
Functions
*/
    const register = body => {
        // Search for user
        return new Promise( (resolve, reject) => {

            UserModel.findOne({ email: body.email }, (error, user) => {
                if(error){ // Mongo Error
                    return reject(error)
                }
                else if(user){ // User already exist
                    return reject('L\'adresse email existe déjà : ', user)
                }
                else{
                    UserModel.findOne({ pseudo: body.pseudo }, (error, user) => {
                        if(error){ // Mongo Error
                            return reject(error)
                        }
                        else if(user){ // User already exist
                            return reject('Le pseudo est déjà utilisé : ', user)
                        }
                        else {
                            // Register new user
                            // Crypt password
                            bcrypt.hash(body.password, 10)
                            .then( hashedPassword => {
                                
                                // Replace clear password
                                body.password = hashedPassword;

                                const friends = [];
                                const contentFriends = {
                                    accepted: [],
                                    pending: [],
                                    recipient: []
                                }

                                friends.push(contentFriends);

                                body.friends = friends;

                                // Save user
                                UserModel.create(body, (error, newUser) => {
                                    if(error){ // Mongo error
                                        return reject(error)
                                    }
                                    else{ // User registrated
                                        return resolve(newUser);
                                    };
                                });
                            })
                            .catch( hashError => {
                                console.log('error', hashError)
                                return reject(hashError);
                            });
                        }
                    }) 
                };
            });
        });
    };

    const login = body => {
        return new Promise( (resolve, reject ) => {

            UserModel.findOne( { email: body.email }, (error, user) => {
                if(error) reject(error)
                else if( !user ) reject('User not found')
                else {
                    // Check password
                    const validPassword = bcrypt.compareSync( body.password, user.password )

                    if( !validPassword ) reject('Password not valid')
                    else {
                        resolve({
                            user: user,
                            token: user.generateJwt()
                        })
                    }
                }
            })
        })
    };

    const getUser = body => {
        return new Promise( (resolve, reject ) => {

            UserModel.findOne( { email: body.email }, (error, user) => {
                if(error) reject(error)
                else if( !user ) reject('User not found')
                else {
                    resolve({ user: user })
                }
            })
        })
    };

    const getUserById = body => {
        return new Promise( (resolve, reject ) => {

            UserModel.findOne( { _id: body.id }, (error, user) => {
                if(error) reject(error)
                else if( !user ) reject('User not found')
                else {
                    resolve({ user: user })
                }
            })
        })
    };

    const getUserByPseudo = body => {
        return new Promise( (resolve, reject ) => {

            UserModel.findOne( { pseudo: body.pseudo }, (error, user) => {
                if(error) reject(error)
                else if( !user ) reject('User not found')
                else {
                    resolve({ user: user })
                }
            })
        })
    };
//

/*
Export
*/
    module.exports = {
        register,
        login,
        getUser,
        getUserById,
        getUserByPseudo
    }
//