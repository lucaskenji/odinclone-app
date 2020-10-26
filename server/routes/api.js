const express = require('express');
const router = express.Router();
const user = require('../controllers/userController.js');
const post = require('../controllers/postController.js');
const comment = require('../controllers/commentController.js');

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

router.get('/posts/:postid/comments', comment.getAllComments);
router.get('/posts/:postid/comments/:commentid', comment.getCommentWithId);
router.post('/posts/:postid/comments', comment.commentValidation, comment.createComment);
router.put('/posts/:postid/comments/:commentid', comment.updateValidation, comment.updateComment);
router.delete('/posts/:postid/comments/:commentid', comment.deleteComment);

module.exports = router;