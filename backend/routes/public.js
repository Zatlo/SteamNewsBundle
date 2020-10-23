const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const Bundles = require('../models/bundles.model');
const SteamGames = require('../models/steamgames.model');
const PopularBundles = require('../models/mostpopularbundles.model');
let UserSession = require('../models/usersession.model'); //requires the model



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

router.route('/populatePublicBundle').get((req, res, next) => {
    const { query } = req;
    const { token } = query;
    if(query.token === ''){
        Bundles.findById(query.bundleObjID)
        .then(bundle => {
            if(bundle.private === true){
                return res.send({
                    success: false,
                    private: true,
                    following: false
                });

            }
            else{
                return res.status(200).send({data: bundle, following: false, private: false});
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));

    }
    else{
        findUser(token, function(error, userFound) {
            user = userFound[0].userId;
    
            Bundles.findById(query.bundleObjID)
            .then(bundle => {
                if(bundle.private === true){
                    return res.send({
                        success: false,
                        private: true,
                        following: false
                    });
    
                }
                else{
                    if(bundle.likesUsers.includes(user))
                        return res.status(200).send({data: bundle, following: true, private: false});
                    else{
                        return res.status(200).send({data: bundle, following: false, private: false});
                    }
                }
            })
            .catch(err => res.status(400).json('Error: ' + err));
        });

    }

    
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

router.route('/likePublicBundle').post((req, res) => {
    const data = req.body;

    findUser(data.token, function(error, userFound) {
        user = userFound[0].userId;
        console.log(user);


        Bundles.find({
            '_id': data.bundleID   
        },{}, function(err, bundle){
            if(err){
                return res.status(400);
            }
            console.log(bundle[0]);
            bundle[0].likesUsers.addToSet(user);
            bundle[0].save()
            .then(response => {
                return res.send({
                    success: true,
                });
    
            })
        });

    });

    
});




module.exports = router;