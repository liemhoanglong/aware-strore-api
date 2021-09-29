const colorModel = require('../model/color.model');

module.exports = {
	getAll: () => {
		let res = colorModel.find().sort('name');
		return res
	},
	getOne: (id) => {
		return res = colorModel.findById(id);
	},
	create: async (data) => {
		const { name, code } = data;
		const temp = new colorModel({
			name, code
		});
		return await temp.save();
	},
	update: async (id, data) => {
		const { name, code } = data;
		let temp = await colorModel.findById(id);
		temp.name = name;
		temp.code = code;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return colorModel.deleteOne({ _id: id });
	},
}

