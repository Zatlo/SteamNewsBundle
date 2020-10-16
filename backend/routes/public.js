const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const Bundles = require('../models/bundles.model');
const SteamGames = require('../models/steamgames.model');
const PopularBundles = require('../models/mostpopularbundles.model');




router.route('/populatePublicBundle').get((req, res) => {
    Bundles.findOne({        
    }, function(err, response){
        
    })

    
});