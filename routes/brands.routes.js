const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const brandController = require('../controllers/brands.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', brandController.getAll);
router.get('/:id', brandController.getOne);
router.post('/', userAuth, adminAuth, brandController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, brandController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, brandController.delete); //need login with admin

module.exports = router;
