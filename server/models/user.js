const mongoose = require('mongoose'); // Erase if already required
const { use } = require('../routes/user');
const bcryct = require('bcrypt')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'user',
    },
    cart:{
        type:Array,
        default:[]
    },
    address:[{type:mongoose.Types.ObjectId, ref:'Address'}],
    wishlist:[{type:mongoose.Types.ObjectId, ref:'Product'}],
    isBlocker:{
        type:Boolean,
        default:false,
    },
    refreshToken:{
        type:String,
    },
    passwordChangeAt:{
        type:String,
    },
    passwordResetToken:{
        type:String,
    },
    passwordResetExpires:{
        type:String,
    },
},{
    timestamps:true
});
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next
    }
     const salt = bcryct.genSaltSync(10)
     this.password = await bcryct.hash(this.password, salt)
 })

userSchema.methods = {
    isCorrectPassword: async function(password){
        return await bcryct.compare(password, this.password)
    }
}

//Export the model
module.exports = mongoose.model('User', userSchema);