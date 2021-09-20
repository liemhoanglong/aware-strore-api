const express = require('express');

const { adminAuth, userAuth } = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comments.controller');

const router = express.Router();
/* GET users listing. */
router.get('/', commentController.getAll);
router.get('/rate/:id', commentController.getRate);
router.get('/product/:id', commentController.getCommentsByProductId);
router.get('/order', userAuth, commentController.getOneByOrder);

router.get('/:id', commentController.getOne);
router.post('/', userAuth, commentController.create); //need login
router.put('/:id', userAuth, commentController.update); //need login
router.delete('/:id', userAuth, commentController.delete); //need login

module.exports = router;
