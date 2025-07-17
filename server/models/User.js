const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the structure of the User document
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    // 'userTier' determines the user's subscription level
    userTier: { type: String, enum: ['normal', 'pro'], default: 'normal' },
    // 'guideCount' tracks how many guides a 'normal' user has generated
    guideCount: { type: Number, default: 0 },
    // 'guideResetDate' tracks when the guide count should reset for normal users
    guideResetDate: { type: Date, default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }
});

// Middleware to hash password before saving a new user
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);