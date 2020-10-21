const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const bcrypt = require('bcrypt');
const UserSession = require('../models/usersession.model');


//our first route first impoint  handles incoming http git requests



//handlkes post requests
router.route('/account/signup').post((req, res ) => {
    const { body } = req;
        const {
            password

        } = body;
        let{
            username,
            email
        } = body;

        if(!username){
            return res.status(400).send({
                success: false,
                message: 'Error: username cannot be blank'
            });
        }
        if(!email){
            return res.status(400).send({
                success: false,
                message: 'Error: email cannot be blank'
            });
        }
        if(!password){
            return res.status(400).send({
                success: false,
                message: 'Error: password cannot be blank'
            });
        }

        if(username.length < 3){
            return res.status(400).send({
                success: false,
                message: 'Error: username must be atleast 3 characters'
            });
        }

        username = username.toLowerCase();
        email = email.toLowerCase();

        //steps
        //1 verify email doesnt exist
        //2 save
        errorMessage = '';
        
        User.find({ //asynchronous sucks!
            username: username
        }, (err, previousUsers) => {
            if(err) {
                return res.status(409).send({
                    success: false,
                    message: 'Error: Server error 1'
                
                });
            }
            if(previousUsers.length > 0) {
                errorMessage += 'Username already exists! ';
            }
        });



        User.find({
            email: email
        }, (err, previousEmails) => {
            if(err) {
                return res.status(409).send({
                    success: false,
                    message: 'Error: Server error 2'
                });
                
            }
            else if(previousEmails.length > 0) {
                return res.status(400).send({
                    success: false,
                    message: errorMessage += 'Email already exists!'
                });
            }
            else if(errorMessage != ''){
                return res.status(400).send({
                    success: false,
                    message: errorMessage
                });
            }

            //save new user

            const newUser = new User();

            newUser.email = email;
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if(err) {
                    return res.status(409).json({
                        success: false,
                        message: 'Not able to create user error'
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'Successful sign up'
                });
            })
        });
});


router.route('/account/signin').post((req, res ) => { //does not care about username
    const { body } = req;
        const {
            password

        } = body;
        let{
            email
        } = body;

        if(!email){
            return res.status(400).send({
                success: false,
                message: 'Error: email cannot be blank'
            });
        }
        if(!password){
            return res.status(400).send({
                success: false,
                message: 'Error: password cannot be blank'
            });
        }

        email = email.toLowerCase();

        User.find({
            email: email
        }, ( err, users) => {
            if(err) {
                return res.status(400).send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            if(users.length != 1) {
                return res.status(400).send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }

            const user = users[0];
            if(!user.validPassword(password)) {
                return res.status(400).send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }

            //otherwise correct user/ make user sessionn

            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if(err){
                    return res.status(400).send({
                        success: false,
                        message: 'Error: server error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id
                });
            });

        });
});


//get the token
//verify token is one of a kind and is not deleted
router.route('/account/verify').get((req, res ) => {

    const { query } = req;
    const { token } = query;

    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: server error'
            });
        }
        if(sessions.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        }
        else {
            User.find({
                _id: sessions[0].userId
            },{username:1, email:1, _id:0},(err, user) => {
                return res.send({
                    success: true,
                    username: user[0].username,
                    email: user[0].email
                });
            });
        }
    });

});


router.route('/account/logout').get((req, res ) => {

    const { query } = req;
    const { token } = query;
    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set:{
            isDeleted:true
        }
    }, null, (err, sessions) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: server error'
            });
        }
        return res.send({ // still sends good if bad token but does not change to true
            success: true,
            message: 'Successfully logged out!'
        });
    });
});

module.exports = router;