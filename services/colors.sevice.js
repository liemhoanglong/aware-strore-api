const colorModel = require('../model/color.model');

module.exports = {
	getAll: () => {
		let res = colorModel.find();
		return res
	},
	getOne: (id) => {
		return res = colorModel.findById(id);
	},
	create: async (name) => {
		const temp = new colorModel({
			name
		});
		return await temp.save();
	},
	update: async (id, name) => {
		let temp = await colorModel.findById(id);
		temp.name = name;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return colorModel.deleteOne({ _id: id });
	},
}

