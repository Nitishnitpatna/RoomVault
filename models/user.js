const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

//  Passport-local-mongoose automaticly implement's the username, hashing ,salting and hashpassword to our user schema so no need to define the field of this thing's in our userSchema

//  And also it add some method's to our schema where it get plugin
const userSchema = new Schema({
    email : {
        type: String,
        required : true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);