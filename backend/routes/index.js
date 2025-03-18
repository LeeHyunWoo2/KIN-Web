const express = require('express');

const authRoutes = require('./user/authRoutes');
const userRoutes = require('./user/userRoutes');
const socialRoutes = require('./user/socialRoutes');
const syncRoutes = require('./user/syncRoutes');
const noteRoutes = require('./notes/noteRoutes');
const categoryRoutes = require('./notes/categoryRoutes');
const tagRoutes = require('./notes/tagRoutes');
const emailRoutes = require('./user/emailRoutes');
const visitorRoutes = require('./visitor/visitorRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/social', socialRoutes);
router.use('/notes', noteRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/sync', syncRoutes);
router.use('/visitor', visitorRoutes);
router.use('/email', emailRoutes);

module.exports = router;