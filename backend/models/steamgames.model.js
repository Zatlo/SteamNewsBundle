const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//validations
const SteamGamesSchema = mongoose.Schema({
    appid: { type: Number, required: true },
    name: { type: String, required: true},
}, {
    timestamps: true,
})

const News = mongoose.model('SteamGames', SteamGamesSchema);

module.exports = News;