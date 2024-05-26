const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/post', userController.createPost);
router.post('/sendFriend', userController.sendFriendRequest);
router.post('/recieveFriend', userController.receiveFriendRequest);
router.post('/update', userController.updateUserInfo);
module.exports = router; // Fixed export
