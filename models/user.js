import { Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
  },
  image: {
    type: String,
  }
}, { timestamps: true });

// Add index for faster queries
UserSchema.index({ email: 1 });

// Cascade delete prompts when user is deleted
UserSchema.post('findByIdAndDelete', async function(user) {
  if (user) {
    try {
      await mongoose.model('Prompt').deleteMany({ creator: user._id });
      console.log(`[DB] Deleted prompts for user ${user._id}`);
    } catch (error) {
      console.error(`[DB] Error cascading delete for user ${user._id}:`, error.message);
    }
  }
});

const User = models.User || model("User", UserSchema);

export default User;