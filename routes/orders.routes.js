const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const orderController = require('../controllers/orders.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);
router.post('/', userAuth, adminAuth, orderController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, orderController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, orderController.delete); //need login with admin

module.exports = router;
