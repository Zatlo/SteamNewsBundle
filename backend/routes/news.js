const router = require('express').Router();
let User = require('../models/user.model'); //requires the model
const News = require('../models/news.model');


//same as user.js route
router.route('/').get((req, res) => {
    News.find() //mongoose method gets list of users and returns a promise
    .then(news => res.json(news))//returns users from database
    .catch(err => res.status(400).json('Error: ' + err)); //if error return error
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const game = Number(req.body.game);
    const date = Date.parse(req.body.date);

    const newNews = new News({
        name,
        description,
        game,
        date,
    });

    newNews.save()
    .then(() => res.json('Exercise added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//:id is a object id, returns specific of that object id
router.route('/:id').get((req, res) => {
    News.findById(req.params.id)
    .then(news => res.json(news))
    .catch(err => res.status(400).json('Error: ' + err));
});

//delete specific id
router.route('/:id').delete((req, res) => {
    News.findByIdAndDelete(req.params.id)
    .then(() => res.json('News Page deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    News.findById(req.params.id)
    .then(news => {
        news.name = req.body.name;
        news.description = req.body.description;
        news.game = Number(req.body.game);
        news.date = Date.parse(req.body.date);

        news.save()
            .then(() => res.json('News page updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
        
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;