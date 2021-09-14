const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const cateController = require('../controllers/cates.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', cateController.getAll);
router.get('/by-group/:id', cateController.getByCateGroup);
router.get('/by-list-and-group/:catelist/:categroup', cateController.getByCategroupAndCatelist);
router.get('/by-list/:id', cateController.getByCatelist);
router.get('/:id', cateController.getOne);
router.post('/', userAuth, adminAuth, cateController.create); //need login with admin
// router.put('/:id', cateController.update); //need login with admin
router.put('/:id', userAuth, adminAuth, cateController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, cateController.delete); //need login with admin

module.exports = router;
