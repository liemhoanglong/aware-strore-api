const commentsController = require('../controllers/comments.controller');
const commentModel = require('../model/comment.model');

module.exports = {
	getAll: () => {
		let res = commentModel.find();
		return res
	},
	getRate: async (productId) => {
		let res = await commentModel.find({ productId });
		let rate = 0;
		for (let i = 0; i < res.length; i++) {
			rate += res[i].star;
		}
		return Math.ceil(rate / res.length);
	},
	getCommentsByProductId: async (productId, query) => {
		const initQuery = {
			page: 1,
			limit: 4,
		}
		const executeQuery = Object.assign(initQuery, query);
		executeQuery.page--;
		let res = await commentModel.find({ productId }).populate('authorId');
		return {
			count: res.length,
			comments: res
				.slice(
					executeQuery.page * executeQuery.limit,
					++executeQuery.page * executeQuery.limit,
				),
		};
	},
	getOneByOrder: (authorId, query) => {
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

