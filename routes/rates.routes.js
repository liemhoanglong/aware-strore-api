const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const rateController = require('../controllers/rates.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', rateController.getAll);
router.get('/:id', rateController.getOne);
router.post('/', userAuth, adminAuth, rateController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, rateController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, rateController.delete); //need login with admin

module.exports = router;
