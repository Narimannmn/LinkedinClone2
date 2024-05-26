const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  profilePicture: {
    type: String // This could be a URL to the image
  },
  walletAddress: {
    type: String,
    required: true
  },
  friends: [{ type: String }], // Array of wallet addresses of friends
  balance: {
    type: Number,
    default: 0 // Default balance is set to 0
  },
  posts: [{
    content: String,
    author: String // Wallet address of the author
  }],
  friendRequestsSent: [{ type: String }], // Array of wallet addresses of sent friend requests
  friendRequestsReceived: [{ type: String }] // Array of wallet addresses of received friend requests
});

const User = mongoose.model('User', userSchema);

module.exports = User;
