const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const Bundles = require('../models/bundles.model');
let UserSession = require('../models/usersession.model'); //requires the model
//const { useCallback } = require('react');
const SteamGames = require('../models/steamgames.model');
const PopularBundles = require('../models/mostpopularbundles.model');

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

router.route('/delete').post((req, res) => {
    const { body } = req;
    const {token} = body.token;
    //const { bundleID } = req.body[0]._id;
    const bundleID = body.bundleObjID;
    //console.log(token);

    findUser(token, function(error, userFound) {//find user session therefore user
        user = userFound[0].userId;

        User.findById(user)
        .then(userAcc =>{ //get users bundle and delete from thier bundle
            //console.log(user);
            userAcc.bundles.pull(bundleID);
            userAcc.save()
            .then(response => {
                Bundles.findByIdAndDelete({//delete bundle from the bundles db
                    '_id': bundleID,   
                }, function(err, response2){
                    if(!err){
                        return res.send({success: true, message: "Bundle deleted!"});
                    }
                });
            });
        })
    });

});

router.route('/increaselikes').post((req, res) => {
    const { query } = req;

    const bundleID = '5f649f1592c4d45da4bccf6f';
    const randInt = 42;

    Bundles.findById(bundleID)
    .then(bundle =>{
        bundle.likes = randInt;
        bundle.save()
        return res.send(bundle);
    })

    //get bundle id
    //increase likes
    //update mostpopular db
    //simple

    
});

router.route('/mostpopularbundles').get((req, res) => {
    PopularBundles.findOne({        
    }, function(err, response){
        Bundles.find({
            '_id': response.bundles   
        },{name:1, description: 1, likes: 1, _id:1}, function(err, bundleInfo){
            return res.send(bundleInfo);
        });
    })

    
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
            if(err){
                console.log(err);
            }
            gameObjID = game[0]._id;
            if(bundle[0].games.length >= 7){
                return res.status(400).send({
                    success: false,
                    message: 'Exceeded number of games'
                });
            }
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