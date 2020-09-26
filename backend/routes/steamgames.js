const router = require('express').Router();
const SteamGames = require('../models/steamgames.model');


router.route('/games').get((req, res, next) => {
    const { query } = req;
    const { userSearch } = query;

    SteamGames.find({
        "name": {'$regex': userSearch, $options:'i' }
    }, {appid: 0},function(err, games){
        return res.json(games);
    }).limit( 6 )
});


module.exports = router;