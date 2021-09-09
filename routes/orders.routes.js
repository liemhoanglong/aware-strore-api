const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const orderController = require('../controllers/orders.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', userAuth, adminAuth, orderController.getAll);//need login with admin
router.get('/my', userAuth, orderController.getMyOrder);//need login with admin
router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);
router.post('/create', userAuth, orderController.create); //need login with admin
// router.put('/cancel/:id', userAuth, orderController.cancelOrder); //need login
router.get('/cancel/:id', userAuth, orderController.cancelOrder); //need login
router.put('/update-status/:id', userAuth, adminAuth, orderController.updateStatus); //need login with admin
router.delete('/:id', userAuth, adminAuth, orderController.delete); //need login with admin

module.exports = router;
