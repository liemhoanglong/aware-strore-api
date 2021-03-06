const categroupModel = require('../model/categroup.model');

module.exports = {
	getAll: () => {
		return categroupModel.find()
		// .populate({ path: "belongCatelist" });
	},
	getAllByAdmin: () => {
		return categroupModel.find()
			.populate({ path: "belongCatelist" })
			.sort('name');
	},
	getOne: (id) => {
		return res = categroupModel.findById(id)
		// .populate({ path: "belongCatelist" });
	},
	getByCatelist: (id) => {
		return res = categroupModel.find({ belongCatelist: id })
	},
	create: async (name, belongCatelist) => {
		console.log(belongCatelist)
		const temp = new categroupModel({
			name,
			belongCatelist
		});
		return await temp.save();
	},
	update: async (id, name, belongCatelist) => {
		let temp = await categroupModel.findById(id);
		temp.name = name;
		temp.belongCatelist = belongCatelist;
		return await temp.save();
	},
	delete: (id) => {//need to check cate belong
		return categroupModel.deleteOne({ _id: id });
	},
}

