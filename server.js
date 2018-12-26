const express = require('express');
require('dotenv').config();
const port = process.env.PORT;

// Import des routes
const AuthRouterClass = require('./Auth/auth.routes');
const MatchRouterClass = require('./Matchs/match.routes');
const FriendsRouterClass = require('./Friends/friends.routes');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// URL de connexion à la bdd mLab
const dbuser = "root";
const dbpassword = "betroom123";
const urlmongo = "mongodb://" + dbuser + ":" + dbpassword + "@ds013569.mlab.com:13569/betroom";

// Connexion entre l'API et la BDD
mongoose.connect(urlmongo, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function() {
    console.log('Connexion à la BDD OK.');
})

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRouter = new AuthRouterClass();
const matchRouter = new MatchRouterClass();
const friendsRouter = new FriendsRouterClass();

app.use('/api/match', matchRouter.init());
app.use('/api/auth', authRouter.init());
app.use('/api/friends', friendsRouter.init());

app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`);
})