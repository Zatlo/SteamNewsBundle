const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const {newsSchema} = require('./news.model.js').schema; //import news schema

//validations
const bundlesSchema = new Schema({
    name: { type: String, required: true },
    games: [ { type: Schema.Types.ObjectId, default: [] } ],
    description: { type: String, required: true },
    date: { type: Date, default: Date.now() },
}, {
    timestamps: true,
})

const Bundles = mongoose.model('Bundles', bundlesSchema);

module.exports = Bundles;