const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/userController.js');
const post = require('../controllers/postController.js');
const comment = require('../controllers/commentController.js');
const friendRequest = require('../controllers/friendRequestController.js');
const auth = require('../controllers/auth.js');

router.get('/users', user.getAllUsers);
router.get('/users/search/:pattern', user.searchUser);
router.get('/users/:userid', user.getUserWithId);
router.post('/users', user.registerValidation, user.userValidation, user.createUser);
router.put('/users/:userid', user.userValidation, user.updateUser);
router.delete('/users/:userid', user.deleteUser);
router.get('/users/:userid/friendrequests', user.getUserFriendRequests);
router.get('/users/:userid/posts', user.getUserPosts);
router.put('/users/:userid/friend', user.addFriend);
router.put('/users/:userid/unfriend', user.removeFriend);

router.get('/posts', post.getAllPosts);
router.get('/posts/relevant/:userid', post.getRelevantPosts);
router.get('/posts/:postid', post.getPostWithId);
router.post('/posts', post.postValidation, post.createPost);
router.put('/posts/:postid', post.updateValidation, post.updatePost);
router.delete('/posts/:postid', post.deletePost);
router.put('/posts/:postid/like', post.likePost);
router.put('/posts/:postid/dislike', post.dislikePost);

router.get('/posts/:postid/comments', comment.getAllComments);
router.get('/posts/:postid/comments/:commentid', comment.getCommentWithId);
router.post('/posts/:postid/comments', comment.commentValidation, comment.createComment);
router.put('/posts/:postid/comments/:commentid', comment.updateValidation, comment.updateComment);
router.delete('/posts/:postid/comments/:commentid', comment.deleteComment);
router.put('/posts/:postid/comments/:commentid/like', comment.likeComment);
router.put('/posts/:postid/comments/:commentid/dislike', comment.dislikeComment);

router.get('/friendrequests', friendRequest.getAllRequests);
router.get('/friendrequests/:requestid', friendRequest.getRequestWithId);
router.post('/friendrequests', friendRequest.requestValidation, friendRequest.createRequest);
router.put('/friendrequests/:requestid', friendRequest.updateRequest);
router.delete('/friendrequests/:requestid', friendRequest.deleteRequest);

router.get('/islogged', auth.checkAuth);
router.get('/logout', auth.logout);
router.post('/login', passport.authenticate('local'), auth.authenticate);
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: process.env.FRONTEND_URL, 
  failureRedirect: process.env.FRONTEND_URL + '/login'
}));

module.exports = router;