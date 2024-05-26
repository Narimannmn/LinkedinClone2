const express = require('express');
const router = express.Router();
const userRouter = require('./UserRouter');

router.use('/api', userRouter);

module.exports = router; // Fixed export
