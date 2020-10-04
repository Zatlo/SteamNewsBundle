const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const Bundles = require('../models/bundles.model');
let UserSession = require('../models/usersession.model'); //requires the model
//const { useCallback } = require('react');
const SteamGames = require('../models/steamgames.model');
const { hashSync } = require('bcrypt');





async function findUser(token, callback) {
    await UserSession.find({
        _id: token,
        isDeleted: false
    }, function(err, userObj){
        if(err){
            return callback(err);
        } else if (userObj){
            return callback(null,userObj);
        } else {
            return callback();
        }
    });
}

//same as user.js route

router.route('/populate').get((req, res ) => {
    const { query } = req;
    const { token } = query;

    let userBundles = [];

    findUser(token, function(error, userFound) {
        user = userFound[0].userId;

        User.findById(user,{bundles:1, _id:0})
        .then(bundles =>{ //bundles is an object
            bundles = bundles._doc;
            let arr3 = Array.from(Object.values(bundles.bundles));
            //console.log(bundles.bundles);
            //console.log(typeof bundles)
            //const r = findBundles(arr3);

            //console.log(r);
            Bundles.find({
                '_id': arr3   
            }, function(err, docs){
                //console.log(docs);
                return res.send(docs);
            });
            
        })
        .catch(err => res.status(400).json('Error: ' + err));
    });

    
    
});


router.route('/add').post((req, res) => {
    const { query } = req;
    const { token } = req.body.token;

    const name = req.body.name;
    const description = req.body.description;

    const newBundles = new Bundles({
        name,
        description,
    });

    findUser(token, function(error, userFound) {
        userToken = userFound[0].userId;


        const username = userToken;
        User.findById(username)
        .then(user => {

            user.bundles.push(newBundles.id);

            user.save()
                .then(() => res.send({success: true, message: "Bundle created and user updated!"}))
                .catch(err => {
                    if(err){
                        return res.status(400).send({
                            success: false,
                            message: 'Failed to add to user'
                        });
                    }
                })
        })
        newBundles.save()
        .catch(err => res.status(400).json('Error: ' + err));
    
    });

    
});

router.route('/steamgame/add').post((req, res) => {
    const bundleID = req.body.bundleObjID;
    const gameID = req.body.gameObjID;

    Bundles.find({
        '_id': bundleID,   
    }, function(err, bundle){
        //console.log(docs);

        SteamGames.find({
            '_id': gameID
        }, function(err, game){
            gameObjID = game[0]._id;
            bundle[0].games.push(gameObjID);
            bundle[0].save()
            return res.send(bundle);


        });

    });

});



router.route('/steamgame/populate').get((req, res, next ) => { //populate page with steam games
    const { query } = req;
    const { bundleObjID } = query;

    //bundle id
    Bundles.find({
        '_id': bundleObjID   
    },{games:1, _id:0}, function(err, games){
        //bundles = bundles._doc;
        //console.log(games[0]);
        let gameslist = games[0].games;

        SteamGames.find({
            '_id': gameslist
        }, function(err, gamesContent){
            //console.log(gamesContent);
            return res.send(gamesContent);

        });

    });
    
    
    
});
module.exports = router;