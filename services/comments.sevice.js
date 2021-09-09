const commentModel = require('../model/comment.model');

module.exports = {
	getAll: () => {
		let res = commentModel.find();
		return res
	},
	getOne: (id) => {
		return res = commentModel.findById(id);
	},
	create: async (name) => {
		const temp = new commentModel({
			name
		});
		return await temp.save();
	},
	update: async (id, name) => {
		let temp = await commentModel.findById(id);
		temp.name = name;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return commentModel.deleteOne({ _id: id });
	},
}

