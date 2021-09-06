const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', userAuth, adminAuth, userController.getAll); // need adminauth
router.get('/profile', userAuth, userController.getProfile); //need login
router.post('/register', userController.register);
router.put('/edit-profile', userAuth, userController.update); //need login
router.post('/login', userController.login);

module.exports = router;
