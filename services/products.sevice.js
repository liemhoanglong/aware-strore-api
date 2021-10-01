const productModel = require('../model/product.model');
const escapeRegex = require('../utils/escapseRegex');

module.exports = {
	getAll: () => {
		let res = productModel.find();
		return res
	},
	getAllProductName: () => {
		let res = productModel.find().select('name');
		return res
	},
	getOne: (id) => {
		return res = productModel.findById(id).populate('brand colors catelist categroup');
	},
	getOneByAdmin: (id) => {
		return res = productModel.findById(id);
	},
	getProductsWithConditions: async (query) => {
		const initQuery = {
			page: 1,
			limit: 20,
			name: '',
			brand: '',
			catelist: '',
			categroup: '',
			cate: '',
			color: '',
			size: '',
			minprice: '',
			maxprice: '',
			status: '',
			sort: '',
		};
		const executeQuery = Object.assign(initQuery, query);
		executeQuery.page--;
		executeQuery.name = new RegExp(escapeRegex(executeQuery.name), 'gi');
		// executeQuery.status = executeQuery.status === '' ? 1 : Number(executeQuery.status);
		let res = productModel.find({
			name: executeQuery.name,
			isDelete: 0,
			price: {
				$gte: Number(executeQuery.minprice ? executeQuery.minprice : 0),
				$lte: Number(executeQuery.maxprice ? executeQuery.maxprice : 10000000)
			}
		})
		// .populate('color brand'); // get color name and brand name
		if (executeQuery.size)//check quantity > 0
			res = res.find({ 'size': { $elemMatch: { name: executeQuery.size } } });
		if (executeQuery.brand)
			res = res.find({ brand: executeQuery.brand });
		if (executeQuery.color) {
			console.log('color --------------- ' + executeQuery.color)
			res = res.find({ 'colors': executeQuery.color });
		}
		if (executeQuery.catelist)
			res = res.find({ catelist: executeQuery.catelist });
		if (executeQuery.categroup)
			res = res.find({ categroup: executeQuery.categroup });
		if (executeQuery.cate)
			res = res.find({ cate: executeQuery.cate });
		if (executeQuery.status)
			res = res.find({ status: executeQuery.status });
		if (executeQuery.sort) {
			if (executeQuery.sort == 1) //a->z
				res = res.sort({ "name": 1 });
			else if (executeQuery.sort == 2) //asc-price
				res = res.sort({ "price": 1 });
			else if (executeQuery.sort == 3) //desc-price
				res = res.sort({ "price": -1 });
		}

		//execute the query above
		res = await res.exec();
		return {
			count: res.length,
			products: res
				.slice(
					executeQuery.page * executeQuery.limit,
					++executeQuery.page * executeQuery.limit,
				),
		}
	},
	getProductsWithConditionsAdmin: async (query) => {
		const initQuery = {
			page: 1,
			limit: 10,
			name: '',
			status: '',
			sort: 0,
		};
		const executeQuery = Object.assign(initQuery, query);
		executeQuery.page--;
		executeQuery.name = new RegExp(escapeRegex(executeQuery.name), 'gi');
		// executeQuery.status = executeQuery.status === '' ? 1 : Number(executeQuery.status);
		let res = productModel.find({
			name: executeQuery.name,
			isDelete: 0,
		})
			.populate('catelist categroup');
		if (executeQuery.status)
			res = res.find({ status: executeQuery.status });
		if (executeQuery.sort) {
			if (executeQuery.sort == 1) //a->z
				res = res.sort({ "name": 1 });
			else if (executeQuery.sort == 2) //asc-price
				res = res.sort({ "price": 1 });
			else if (executeQuery.sort == 3) //desc-price
				res = res.sort({ "price": -1 });
			else //date add
				res = res.sort({ "postedDate": 1 });
		}

		//execute the query above
		res = await res.exec();
		return {
			count: res.length,
			products: res
				.slice(
					executeQuery.page * executeQuery.limit,
					++executeQuery.page * executeQuery.limit,
				),
		}
	},
	create: async (data) => {
		const temp = new productModel(data);
		return await temp.save();
	},
	update: async (id, data) => {
		let { name, price, info, size, brand, imageList, catelist, categroup, cate, colors, sold, status } = data;
		let temp = await productModel.findById(id);
		if (name) temp.name = name;
		if (price) temp.price = price;
		if (info) temp.info = info;
		if (size) temp.size = size;
		if (brand) temp.brand = brand;
		if (imageList) temp.imageList = imageList;
		if (catelist) temp.catelist = catelist;
		if (categroup) temp.categroup = categroup;
		if (cate) temp.cate = cate;
		if (colors) temp.colors = colors;
		if (sold) temp.sold = sold;
		if (status) temp.status = Number(status);
		return await temp.save();
	},
	delete: async (id) => {
		let temp = await productModel.findById(id);
		temp.isDelete = 1;
		return await temp.save();
	},
}

