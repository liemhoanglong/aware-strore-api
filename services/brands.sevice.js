const brandModel = require('../model/brand.model');

module.exports = {
	getAll: () => {
		let res = brandModel.find();
		return res
	},
	getOne: (id) => {
		return res = brandModel.findById(id);
	},
	create: async (name) => {
		const temp = new brandModel({
			name
		});
		return await temp.save();
	},
	update: async (id, name) => {
		let temp = await brandModel.findById(id);
		temp.name = name;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return brandModel.deleteOne({ _id: id });
	},
}

