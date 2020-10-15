const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//validations
const bundlesSchema = new Schema({
    name: { type: String, required: true },
    games:  { type: [{ type: Schema.Types.ObjectId, default: [] }], validate: [gameLimit, '{PATH} exceeds limit of 10']},
    description: { type: String, required: true },
    private: { type: Boolean, default: false },
    tags: [{ type: String, default: [] }],
    date: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0},
    likesUsers: [{ type: Schema.Types.ObjectId, ref: 'userSchema', default: []}]
    
}, {
    timestamps: true,
});

function gameLimit(val){
    return val.length <= 7;
}

const Bundles = mongoose.model('Bundles', bundlesSchema);

module.exports = Bundles;