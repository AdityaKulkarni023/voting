const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    adharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
    
});

userSchema.pre('save', async function (next) {
    const Person = this;
    if (!Person.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);

        //hash pwd
        const hashedPassword = await bcrypt.hash(Person.password, salt);

        //overrride pain pwd with salt
        Person.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error
    }
}

const user = mongoose.model('user', userSchema)
module.exports = user;