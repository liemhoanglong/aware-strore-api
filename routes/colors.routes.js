const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const colorController = require('../controllers/colors.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', colorController.getAll);

router.get('/:id', colorController.getOne);
router.post('/', userAuth, adminAuth, colorController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, colorController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, colorController.delete); //need login with admin

module.exports = router;
