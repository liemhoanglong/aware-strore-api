const cateModel = require('../model/cate.model');

module.exports = {
	getAll: () => {
		let res = cateModel.find();
		return res
	},
	getOne: (id) => {
		return res = cateModel.findById(id);
	},
	create: async (name, belongCategroup) => {
		const temp = new cateModel({
			name,
			belongCategroup
		});
		return await temp.save();
	},
	update: async (id, name, belongCategroup) => {
		let temp = await cateModel.findById(id);
		temp.name = name;
		temp.belongCategroup = belongCategroup;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return cateModel.deleteOne({ _id: id });
	},
}

