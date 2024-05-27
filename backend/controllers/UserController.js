const User = require('../models/User');

class UserController {
  async registration(req, res, next) {
    try {
        const { name, bio, profilePicture, walletAddress } = req.body;

      // Check if the user already exists
      let existingUser = await User.findOne({ walletAddress });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create a new user
      const newUser = new User({
        name,
        bio,
        profilePicture,
        walletAddress
      });

      await newUser.save();

      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req, res, next) {
    try {
      const { walletAddress } = req.body;

      // Find the user by wallet address
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User logged in successfully', user });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createPost(req, res, next) {
    try {
      const { walletAddress, content } = req.body;

      // Find the user by wallet address
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user has TOPWEB3 NFT
      if (user.balance < 5) {
        return res.status(403).json({ message: 'User does not have TOPWEB3 NFT' });
      }

      // Create a new post
      const newPost = {
        content,
        author: walletAddress
      };

      user.posts.push(newPost);
      await user.save();

      return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async sendFriendRequest(req, res, next) {
    try {
      const { walletAddress, friendWalletAddress } = req.body;

      // Find the user sending the request
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the user receiving the request
      const friend = await User.findOne({ walletAddress: friendWalletAddress });
      if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
      }

      // Check if friend request has already been sent
      if (user.friendRequestsSent.includes(friendWalletAddress)) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }

      // Add friendWalletAddress to user's sent friend requests
      user.friendRequestsSent.push(friendWalletAddress);
      await user.save();

      // Add walletAddress to friend's received friend requests
      friend.friendRequestsReceived.push(walletAddress);
      await friend.save();

      return res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
      console.error('Error sending friend request:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  async receiveFriendRequest(req, res, next) {
    try {
      const { walletAddress, friendWalletAddress } = req.body;

      // Find the user receiving the friend request
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the user who sent the friend request
      const friend = await User.findOne({ walletAddress: friendWalletAddress });
      if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
      }

      // Check if there is a pending friend request from the friend
      if (!user.friendRequestsReceived.includes(friendWalletAddress)) {
        return res.status(400).json({ message: 'No pending friend request from this user' });
      }

      // Remove friendWalletAddress from user's received friend requests
      user.friendRequestsReceived = user.friendRequestsReceived.filter(request => request !== friendWalletAddress);
      await user.save();

      // Add walletAddress to friend's friends list
      friend.friends.push(walletAddress);
      await friend.save();

      // Add friendWalletAddress to user's friends list
      user.friends.push(friendWalletAddress);
      await user.save();

      // Check if user's friend count is a multiple of 5
      if (user.friends.length % 2 === 0) {
        // Increment user's balance by 5
        user.balance += 5;
        await user.save();
      }

      // Check if friend's friend count is a multiple of 5
      if (friend.friends.length % 2 === 0) {
        // Increment friend's balance by 5
        friend.balance += 5;
        await friend.save();
      }

      return res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  async updateUserInfo(req, res, next) {
    try {
      const { walletAddress, name, bio, profilePicture } = req.body;

      // Find the user by wallet address
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (name) user.name = name;
      if (bio) user.bio = bio;
      if (profilePicture) user.profilePicture = profilePicture;

      await user.save();

      return res.status(200).json({ message: 'User information updated successfully', user });
    } catch (error) {
      console.error('Error updating user information:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  async getFriendRequests(req, res, next) {
    try {
      const { walletAddress } = req.body;
      console.log(walletAddress)
      // Find the user based on the wallet address
      const user = await User.findOne({ walletAddress });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Extract friend requests received
      const friendRequestsReceived = user.friendRequestsReceived;

      return res.status(200).json({ friendRequestsReceived });
    } catch (error) {
      console.error("Error getting friend requests:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getFriends(req, res, next) {
    try {
      const { walletAddress } = req.body;

      // Find the user by wallet address
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the list of friends
      return res.status(200).json({ friends: user.friends });
    } catch (error) {
      console.error('Error getting friends:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new UserController();
