const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/post', userController.createPost);
router.post('/sendFriend', userController.sendFriendRequest);
router.post('/friend', userController.getFriendRequests);
router.post('/recieveFriend', userController.receiveFriendRequest);
router.post('/update', userController.updateUserInfo);
router.post('/getFriends', userController.getFriends); // Add this line

module.exports = router;
