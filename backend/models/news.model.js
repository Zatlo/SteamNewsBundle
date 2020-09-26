const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//validations
const newsSchema = new Schema({
    name: { type: String, required: true },
    game: { type: String, required: true},
    description: { type: String, required: true },
    date: { type: Date, required: true},
}, {
    timestamps: true,
})

const News = mongoose.model('News', newsSchema);

module.exports = News;