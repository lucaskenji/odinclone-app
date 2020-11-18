const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/userController.js');
const post = require('../controllers/postController.js');
const comment = require('../controllers/commentController.js');
const friendRequest = require('../controllers/friendRequestController.js');
const auth = require('../controllers/auth.js');

router.get('/users', auth.checkReferer, user.getAllUsers);
router.get('/users/search/:pattern', auth.checkReferer, user.searchUser);
router.get('/users/:userid', auth.checkReferer, user.getUserWithId);
router.post('/users', auth.checkReferer, user.registerValidation, user.userValidation, user.createUser);
router.put('/users/:userid', auth.checkReferer, user.userValidation, user.updateUser);
router.delete('/users/:userid', auth.checkReferer, user.deleteUser);
router.get('/users/:userid/friendrequests', auth.checkReferer, user.getUserFriendRequests);
router.get('/users/:userid/posts', auth.checkReferer, user.getUserPosts);
router.put('/users/:userid/friend', auth.checkReferer, user.addFriend);
router.put('/users/:userid/unfriend', auth.checkReferer, user.removeFriend);

router.get('/posts', auth.checkReferer, post.getAllPosts);
router.get('/posts/relevant/:userid', auth.checkReferer, post.getRelevantPosts);
router.get('/posts/:postid', auth.checkReferer, post.getPostWithId);
router.post('/posts', auth.checkReferer, auth.verifyToken, post.postValidation, post.createPost);
router.put('/posts/:postid', auth.checkReferer, post.updateValidation, post.updatePost);
router.delete('/posts/:postid', auth.checkReferer, post.deletePost);
router.put('/posts/:postid/like', auth.checkReferer, post.likePost);
router.put('/posts/:postid/dislike', auth.checkReferer, post.dislikePost);

router.get('/posts/:postid/comments', auth.checkReferer, comment.getAllComments);
router.get('/posts/:postid/comments/:commentid', auth.checkReferer, comment.getCommentWithId);
router.post('/posts/:postid/comments', auth.checkReferer, auth.verifyToken, comment.commentValidation, comment.createComment);
router.put('/posts/:postid/comments/:commentid', auth.checkReferer, comment.updateValidation, comment.updateComment);
router.delete('/posts/:postid/comments/:commentid', auth.checkReferer, comment.deleteComment);
router.put('/posts/:postid/comments/:commentid/like', auth.checkReferer, comment.likeComment);
router.put('/posts/:postid/comments/:commentid/dislike', auth.checkReferer, comment.dislikeComment);

router.get('/friendrequests', auth.checkReferer, friendRequest.getAllRequests);
router.get('/friendrequests/:requestid', auth.checkReferer, friendRequest.getRequestWithId);
router.post('/friendrequests', auth.checkReferer, auth.verifyToken, friendRequest.requestValidation, friendRequest.createRequest);
router.put('/friendrequests/:requestid', auth.checkReferer, friendRequest.updateRequest);
router.delete('/friendrequests/:requestid', auth.checkReferer, friendRequest.deleteRequest);

router.get('/islogged', auth.checkReferer, auth.checkAuth);
router.get('/logout', auth.logout);
router.post('/login', passport.authenticate('local'), auth.authenticate);
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', auth.facebookCallback);

module.exports = router;