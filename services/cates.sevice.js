const cateModel = require('../model/cate.model');

module.exports = {
	getAll: () => {
		let res = cateModel.find()
		// .populate({ path: "belongCategroup" });
		return res
	},
	getByCateGroup: (id) => {
		let res = cateModel.find()
			.populate({ path: "belongCategroup", match: { _id: id } });
		return res
	},
	getByCategroupAndCatelist: async (cateGroup, cateList) => {
		let res = await cateModel.find({ 'belongCategroup': cateGroup, 'belongCatelist': cateList })
		// .populate('belongCategroup belongCatelist');
		return res
	},
	getByCatelist: async (cateList) => {
		let res = await cateModel.find({ 'belongCatelist': cateList })
		// .populate({ path: "belongCatelist" });
		return res
	},
	getOne: (id) => {
		return res = cateModel.findById(id)
		// .populate({ path: "belongCategroup" });
	},
	create: async (name, belongCategroup, belongCatelist) => {
		const temp = new cateModel({
			name,
			belongCategroup,
			belongCatelist
		});
		return await temp.save();
	},
	update: async (id, name, belongCategroup, belongCatelist) => {
		let temp = await cateModel.findById(id);
		temp.name = name;
		temp.belongCategroup = belongCategroup;
		temp.belongCatelist = belongCatelist;
		return await temp.save();
	},
	delete: (id) => {//need to check cate group belong
		return cateModel.deleteOne({ _id: id });
	},
}

