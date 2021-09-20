const commentsController = require('../controllers/comments.controller');
const commentModel = require('../model/comment.model');

module.exports = {
	getAll: () => {
		let res = commentModel.find();
		return res
	},
	getOneByOrder: (authorId, query) => {
		console.log(query)
		return res = commentModel.findOne({
			authorId,
			orderId: query.orderId,
			productId: query.productId,
			color: query.color,
			size: query.size,
		});
	},
	getOne: (id) => {
		return res = commentModel.findById(id);
	},
	create: async (authorId, data) => {
		const { title, content, star, productId, color, size, orderId } = data;
		const temp = new commentModel({
			title, content, star, authorId, productId, color, size, orderId
		});
		return await temp.save();
	},
	update: async (id, authorId, data) => {
		const { title, content, star } = data;
		let temp = await commentModel.findById(id);
		if (JSON.stringify(authorId) != JSON.stringify(temp.authorId)) return;
		temp.title = title;
		temp.content = content;
		temp.star = star;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return commentModel.deleteOne({ _id: id });
	},
}

