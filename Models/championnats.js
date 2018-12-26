var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Championnat = new Schema ({
    id: Number,
    nom: String
})

module.exports = mongoose.model('Championnat', Championnat);
