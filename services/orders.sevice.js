const orderModel = require('../model/order.model');

module.exports = {
	getAll: () => {
		let res = orderModel.find();
		return res
	},
	getMyOrder: (userId) => {
		let res = orderModel.find({ userId });
		return res
	},
	getOne: (id) => {
		return res = orderModel.findById(id).populate({
			path: 'items',
			populate: {
				path: 'productId',
				model: 'product',
				// populate: {
				// 	path: 'colors',
				// 	model: 'color'
				// }
			}
		});
	},
	create: async (data) => {
		const temp = new orderModel(data);
		return await temp.save();
	},
	cancelOrder: async (userId, id) => {
		let temp = await orderModel.findById(id);
		if (JSON.stringify(temp.userId) === JSON.stringify(userId)) {
			//need to check this is your order is complete or cancel
			console.log(temp.status)
			if (temp.status === 1)
				return 1;
			if (temp.status === -1)
				return -1;
			temp.status = -1;
			return await temp.save();
		}
		else
			return;
	},
	updateStatus: async (id, status) => {
		let temp = await orderModel.findById(id);
		temp.status = status;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return orderModel.deleteOne({ _id: id });
	},
}

