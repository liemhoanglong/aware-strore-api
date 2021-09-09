const catelistModel = require('../model/catelist.model');

module.exports = {
	getAll: () => {
		let res = catelistModel.find();
		return res
	},
	getOne: (id) => {
		return res = catelistModel.findById(id);
	},
	create: async (name) => {
		const temp = new catelistModel({
			name
		});
		return await temp.save();
	},
	update: async (id, name) => {
		let temp = await catelistModel.findById(id);
		temp.name = name;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return catelistModel.deleteOne({ _id: id });
	},
}

