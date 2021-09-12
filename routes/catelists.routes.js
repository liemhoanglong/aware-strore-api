const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const catelistController = require('../controllers/catelists.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', catelistController.getAll);

router.get('/:id', catelistController.getOne);
router.post('/', userAuth, adminAuth, catelistController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, catelistController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, catelistController.delete); //need login with admin

module.exports = router;
