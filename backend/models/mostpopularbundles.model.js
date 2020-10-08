const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//validations
const popularBundlesSchema = new Schema({
    bundles: [ { type: Schema.Types.ObjectId, ref: 'bundlesSchema' } ],
}, {
    timestamps: true,
})

const PopularBundles = mongoose.model('PopularBundles', popularBundlesSchema);

module.exports = PopularBundles;