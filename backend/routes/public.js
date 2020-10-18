const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const Bundles = require('../models/bundles.model');
const SteamGames = require('../models/steamgames.model');
const PopularBundles = require('../models/mostpopularbundles.model');




router.route('/populatePublicBundle').get((req, res) => {
    const { query } = req;
    Bundles.findById(query.bundleObjID)
    .then(bundle => {
        if(bundle.private === true){
            return res.send({
                success: false,
                message: 'private'
            });
        }
        else{
            return res.status(200).send(bundle);
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));

    
});

router.route('/populatePublicBundleGames').get((req, res) => {
    const { query } = req;

    SteamGames.find({
        '_id': query.gameIDs   
    },{_id:0}, function(err, games){
        if(err){
            return res.status(400);
        }
        res.send(games);
    });

    
});

module.exports = router;