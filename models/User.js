import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    name: { type: String, required: true },
     imageUrl: { type: String, required: true },
      cartItems: { type: Object, default:{}},
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.user || mongoose.model('user', userSchema);
export default User;