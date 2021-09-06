const express = require('express');
const passport = require('passport');

const { adminAuth } = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');

const router = express.Router();
const userAuth = passport.authenticate('jwt', { session: false });
/* GET users listing. */
router.get('/', userAuth, adminAuth, userController.getAll); // need adminauth
router.get('/profile', userAuth, userController.getProfile); //need login
router.post('/register', userController.register);
router.put('/edit-profile', userAuth, userController.update); //need login
router.post('/login', userController.login);

module.exports = router;
