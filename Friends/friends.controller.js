/*
Import
*/
const UserModel = require('../Models/user.model');
//

/*
Functions
*/
const request = body => {
    // request for friends
    return new Promise( (resolve, reject) => {
        UserModel.findById(body.idUserA,'friends.pending', (err, user) => {
            if (err) 
                reject('Erreur mongoDB : user not found, ', err);
            else {
                let alreadyPending = false;

                // Check if the user A have already user B in pending
                user.friends.pending.forEach(element => { if ( element == body.idUserB ) { alreadyPending = true;  } })

                if ( alreadyPending === true ) {
                    reject('Reject friend already in pending : ', err)
                } else {
                    UserModel.findByIdAndUpdate(body.idUserA, {
                        $push: { 'friends.pending': body.idUserB }
                    }, (err, usersFindA) => {
                        if (err) { reject("Erreur mongoDB lors de la requête d'amis : ", err) }

                        UserModel.findByIdAndUpdate(body.idUserB, {
                            $push: { 'friends.recipient': body.idUserA }
                        }, { returnOriginal: false }, (err, usersFindB) => {
                            if (err) { reject("Erreur mongoDB lors de la requête d'amis : ", err) }
    
                            resolve( usersFindA, usersFindB )
                        })
                    })
                }
            }
        })
    })
}

const accepted = body => {
    // response for friends
    return new Promise( (resolve, reject) => {

        let newRecipientA = [];
        let newPendingB = [];

        // On recherche le user A pour supprimer l'id du user B du array de recipient
        UserModel.findById(body.idUserA, 'friends.recipient', (err, user) => {
            if (err)
                reject('Erreur mongoDB (findById) : ', err);
            else {
                newRecipientA.push(user.friends.recipient)
                // Delete id of user B in recipient array
                for( let i of newRecipientA.entries()) {
                    if ( i[1] == body.idUserA ) { newRecipientA.splice(i[0], 1) }
                }
            }
        })

        // On recherche le user B pour supprimer l'id du user A du array de pending
        UserModel.findById(body.idUserB, 'friends.pending', (err, user) => {
            if (err)
                reject('Erreur mongoDB (findById) : ', err);
            else {
                newPendingB.push(user.friends.pending)
                // Delete id of user B in recipient array
                for( let i of newPendingB.entries()) {
                    if ( i[1] == body.idUserA ) { newPendingB.splice(i[0], 1) }
                }
            }
        })

        // Add in user A the new recipient array 
        UserModel.findByIdAndUpdate(body.idUserA, {
            $set: { 'friends.recipient': newRecipientA }
        }, { returnOriginal: false }, (err, userFind) => {
            if (err) { reject("Erreur mongoDB (findByIdAndUpdate in accepted) : ", err) }

            // Add id of user B in user A model
            UserModel.findByIdAndUpdate(body.idUserA, {
                $push: { 'friends.accepted': body.idUserB }
            }, { returnOriginal: false }, (err, userFind) => {
                if (err) { reject("Erreur mongoDB (findByIdAndUpdate in accepted) : ", err) }

                // Add in user B the new pending array
                UserModel.findByIdAndUpdate(body.idUserB, {
                    $set: { 'friends.pending': newPendingB }
                }, { returnOriginal: false }, (err, userFind) => {
                    if (err) { reject("Erreur mongoDB (findByIdAndUpdate in accepted) : ", err) }
    
                    // Add in user B, id of user A 
                    UserModel.findByIdAndUpdate(body.idUserB, {
                        $push: { 'friends.accepted': body.idUserA }
                    }, { returnOriginal: false }, (err, userFind) => {
                        if (err) { reject("Erreur mongoDB (findByIdAndUpdate in accepted) : ", err) }
        
                        resolve(userFind)
                    })
                })
            })
        })
    })
};
//

/*
Export
*/
module.exports = {
    request,
    accepted
}
//