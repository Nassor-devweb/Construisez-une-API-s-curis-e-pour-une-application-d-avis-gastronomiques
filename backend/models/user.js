const mongoose = require('mongose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user',userSchema);