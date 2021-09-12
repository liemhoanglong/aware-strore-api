const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comments.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', commentController.getAll);

router.get('/:id', commentController.getOne);
router.post('/', userAuth, adminAuth, commentController.create); //need login with admin
router.put('/:id', userAuth, adminAuth, commentController.update); //need login with admin
router.delete('/:id', userAuth, adminAuth, commentController.delete); //need login with admin

module.exports = router;
