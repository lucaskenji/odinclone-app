const express = require('express');
const router = express.Router();
const user = require('../controllers/userController.js');

router.get('/users', user.getAllUsers);
router.get('/users/:userid', user.getUserWithId);
router.post('/users', user.registerValidation, user.userValidation, user.createUser);
router.put('/users/:userid', user.userValidation, user.updateUser);
router.delete('/users/:userid', user.deleteUser);

module.exports = router;