const Bundles = require('./models/bundles.model');
const PopularBundles = require('./models/mostpopularbundles.model');

module.exports = { //gets the top bundles every hour and adds them to the database!
    recalculateMostPopularBundles: function(){
        Bundles.find({}, '_id').sort({likes: -1}).limit(5).exec(
            function(err, results){
                const newestMostPopularBundles = new PopularBundles();
                newestMostPopularBundles.bundles = results;
                PopularBundles.deleteMany({})
                .then(
                    newestMostPopularBundles.save((err, popularList) => {
                        if(err){
                            console.log(err);
                        }
                    })
                )
                .catch(err => {console.log(err)});
            }
        )
    }
};