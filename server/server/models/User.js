const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema: shape of a user in the database
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, { timestamps: true }); // Adds createdAt and updatedAt

// Before saving user to DB, hash the password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if unchanged
  this.password = await bcrypt.hash(this.password, 10); // Encrypt
  next();
});

// Add method to compare entered password to DB password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the model so we can use it in controllers
module.exports = mongoose.model('User', userSchema);
