const rateModel = require('../model/rate.model');

module.exports = {
	getAll: () => {
		let res = rateModel.find();
		return res
	},
	getOne: (id) => {
		return res = rateModel.findById(id);
	},
	create: async (name) => {
		const temp = new rateModel({
			name
		});
		return await temp.save();
	},
	update: async (id, name) => {
		let temp = await rateModel.findById(id);
		temp.name = name;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return rateModel.deleteOne({ _id: id });
	},
}

