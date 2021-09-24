const orderModel = require('../model/order.model');
const escapeRegex = require('../utils/escapseRegex');

module.exports = {
	getAll: () => {
		let res = orderModel.find();
		return res
	},
	getOrdersWithConditionsAdmin: async (query) => {
		const initQuery = {
			page: 1,
			limit: 10,
			name: '',
			mindate: '2021-09-01',
			maxdate: '',
			status: '',
			sort: 0,
		}
		const executeQuery = Object.assign(initQuery, query);
		executeQuery.page--;
		executeQuery.name = new RegExp(escapeRegex(executeQuery.name), 'gi');
		let date
		if (executeQuery.maxdate === '') {
			date = new Date();
		} else {
			date = new Date(executeQuery.maxdate);
		}
		executeQuery.maxdate = date.setDate(date.getDate() + 1);
		let res = orderModel.find({
			code: executeQuery.name,
			orderedDate: {
				$gte: executeQuery.mindate,
				$lte: executeQuery.maxdate,
			}
		})
			.populate({
				path: 'items',
				populate: [{
					path: 'productId',
					model: 'product',
				}, {
					path: 'color',
					model: 'color',
				}]
			})
		if (executeQuery.status)
			res = res.find({ status: executeQuery.status });

		//execute the query above
		//default sort by ordered Date
		res = await res.sort({ "orderedDate": 1 }).exec();
		return {
			count: res.length,
			orders: res
				.slice(
					executeQuery.page * executeQuery.limit,
					++executeQuery.page * executeQuery.limit,
				),
		};
	},
	getMyOrder: async (userId, query) => {
		const initQuery = {
			page: 1,
			limit: 5,
		}
		const executeQuery = Object.assign(initQuery, query);
		executeQuery.page--;
		let res = await orderModel.find({ userId }).sort({ 'orderedDate': -1 })
			.populate({
				path: 'items',
				populate: [{
					path: 'productId',
					model: 'product',
				}, {
					path: 'color',
					model: 'color',
				}]
			}).exec();
		return {
			count: res.length,
			orders: res
				.slice(
					executeQuery.page * executeQuery.limit,
					++executeQuery.page * executeQuery.limit,
				),
		};
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
	updateIsReview: async (id, index) => {
		let temp = await orderModel.findById(id);
		temp.items[index].isReview = true;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return orderModel.deleteOne({ _id: id });
	},
}

