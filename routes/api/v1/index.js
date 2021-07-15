const express =require('express');
const { route } = require('../../users');
const router =express.Router();
router.use('/posts',require('./posts'));
router.use('/users',require('./users'));


module.exports =router;