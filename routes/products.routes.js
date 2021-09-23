const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const productController = require('../controllers/products.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', productController.getAll);
router.get('/search', productController.getProductsWithConditions);
router.get('/admin-search', productController.getProductsWithConditionsAdmin);
router.get('/:id', productController.getOne);
router.post('/', userAuth, adminAuth, productController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, productController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, productController.delete); //need login with admin

module.exports = router;
