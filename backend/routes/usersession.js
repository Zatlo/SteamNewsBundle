const router = require('express').Router();
let UserSession = require('../models/usersession.model'); //requires the model


router.route('/').get((req, res) => {
    UserSession.findById('5f61dc68bfd55612c0952f40') //mongoose method gets list of users and returns a promise
    .then(sessions => res.json(sessions))//returns users from database
    .catch(err => res.status(400).json('Error: ' + err)); //if error return error
});



module.exports = router;