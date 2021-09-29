const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const categroupController = require('../controllers/categroups.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', categroupController.getAll);
router.get('/admin', categroupController.getAllByAdmin);
router.get('/by-catlists', categroupController.getByCatelist);
router.get('/:id', categroupController.getOne);
router.post('/', userAuth, adminAuth, categroupController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, categroupController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, categroupController.delete); //need login with admin

module.exports = router;
