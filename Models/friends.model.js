/*
Imports & configs
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//


/*
Model definition
*/
const friendsSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'user'},
      recipient: { type: Schema.Types.ObjectId, ref: 'user'},
      status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
      }
})

//

/*
Export
*/
const FriendsModel = mongoose.model('friends', friendsSchema);
module.exports = FriendsModel;
//