const productModel = require('../model/product.model');
const escapeRegex = require('../utils/escapseRegex');

module.exports = {
	getAll: () => {
		let res = productModel.find();
		return res
	},
	getOne: (id) => {
		return res = productModel.findById(id).populate('brand colors');
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
		executeQuery.status = executeQuery.status ? Number(executeQuery.status) : 1;
		let res = productModel.find({
			name: executeQuery.name,
			isDelete: 0,
			price: {
				$gte: Number(executeQuery.minprice ? executeQuery.minprice : 0),
				$lte: Number(executeQuery.maxprice ? executeQuery.maxprice : 10000000)
			},
			status: executeQuery.status,
		}).populate('colors brand'); // get color name and brand name
		if (executeQuery.size)
			res = res.find({ 'size.name': executeQuery.size });
		if (executeQuery.brand)
			res = res.find({ brand: executeQuery.brand });
		if (executeQuery.color)
			res = res.find({ colors: executeQuery.color });
		if (executeQuery.catelist)
			res = res.find({ catelist: executeQuery.catelist });
		if (executeQuery.categroup)
			res = res.find({ categroup: executeQuery.categroup });
		if (executeQuery.cate)
			res = res.find({ cate: executeQuery.cate });
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
	create: async (name, price, size, brand, imageList, catelist, categroup, cate, colors) => {
		const temp = new productModel({
			name, price, size, brand, imageList, catelist, categroup, cate, colors
		});
		return await temp.save();
	},
	update: async (id, data) => {
		let temp = await productModel.findById(id);
		temp.name = name;
		temp.price = price;
		temp.size = size;
		temp.brand = brand;
		temp.imageList = imageList;
		temp.catelist = catelist;
		temp.categroup = categroup;
		temp.cate = cate;
		temp.colors = colors;
		return await temp.save();
	},
	delete: async (id) => {
		let temp = await productModel.findById(id);
		temp.isDelete = 1;
		return await temp.save();
	},
}

