const mongoose = require('mongoose'); 
const { schema } = require('./news.model');
const Schema = mongoose.Schema;
const {bundlesSchema} = require('./bundles.model.js').schema; //imports our news schemas
const bcrypt = require('bcrypt');


//all mongoose schema usually start the same

//name of schema and all the requirements of this schema
const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        minlength: 4,
        default: ''
    },
    password: {
        type: String,
        minlength: 8,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    bundles: [ { type: Schema.Types.ObjectId, ref: 'bundlesSchema' } ], //array of schemas are hard!
},  {
timestamps: true, //create timestamp when created and modifed
});


userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema); //creates the model
//usually the same for any mongoose schema

module.exports = User;