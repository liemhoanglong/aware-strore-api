const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', userAuth, adminAuth, userController.getAll); // need adminauth
router.get('/profile', userAuth, userController.getProfile); //need login
router.post('/register', userController.register);
router.put('/edit-profile', userAuth, userController.update); //need login
router.put('/change-pass', userAuth, userController.changePass); //need login
router.put('/forgot-pass', userController.forgotPass); //forgot pass
router.post('/login', userController.login);
router.post('/admin-login', userController.adminLogin);

//========================>> USER's CART <<======================== 
router.get('/get-cart', userAuth, userController.getCart); // need login
router.put('/update-cart', userAuth, userController.updateCart); //need login

module.exports = router;
