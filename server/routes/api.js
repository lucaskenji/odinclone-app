const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserWithId);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;