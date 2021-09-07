const orderModel = require('../model/order.model');

module.exports = {
	getAll: () => {
		let res = orderModel.find();
		return res
	},
	getOne: (id) => {
		return res = orderModel.findById(id);
	},
	create: async (name) => {
		const temp = new orderModel({
			name
		});
		return await temp.save();
	},
	update: async (id, name) => {
		let temp = await orderModel.findById(id);
		temp.name = name;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return orderModel.deleteOne({ _id: id });
	},
}

