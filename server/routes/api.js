const express = require('express');
const router = express.Router();
const user = require('../controllers/userController.js');
const post = require('../controllers/postController.js');

router.get('/users', user.getAllUsers);
router.get('/users/:userid', user.getUserWithId);
router.post('/users', user.registerValidation, user.userValidation, user.createUser);
router.put('/users/:userid', user.userValidation, user.updateUser);
router.delete('/users/:userid', user.deleteUser);

router.get('/posts', post.getAllPosts);
router.get('/posts/:postid', post.getPostWithId);
router.post('/posts', post.postValidation, post.createPost);
router.put('/posts/:postid', post.updateValidation, post.updatePost);
router.delete('/posts/:postid', post.deletePost);

module.exports = router;