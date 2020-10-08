const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//validations
const bundlesSchema = new Schema({
    name: { type: String, required: true },
    games: [ { type: Schema.Types.ObjectId, default: [] } ],
    description: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0}
}, {
    timestamps: true,
})

const Bundles = mongoose.model('Bundles', bundlesSchema);

module.exports = Bundles;