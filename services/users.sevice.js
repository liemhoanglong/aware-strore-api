const User = require('../model/user.model');
const bcrypt = require("bcrypt");

module.exports = {
	getAll: () => {
		let res = User.find();
		return res
	},
	getOne: (id) => {
		let res = User.findById(id);
		return res
	},
	getUserByUsername: (username) => {
		return User.findOne({ username });
	},
	getUserByName: (name) => {
		return User.findOne({ name });
	},
	create: async (username, name, password) => {
		const saltRound = 10;
		const salt = bcrypt.genSaltSync(saltRound);
		const passwordHash = bcrypt.hashSync(password, salt);
		const newUser = new User({
			username,
			name,
			password: passwordHash
		});
		return await newUser.save();
	},
	update: async (userInfo, username) => {
		//check username is exist
		let userNow = User.findOne({ username });// find user now
		let userWithUsername = User.findOne({ username: userInfo.username });// find user with username
		let userWithName = User.findOne({ name: userInfo.name });// find user with name
		let updateUser = await userNow;
		let checkUsername = await userWithUsername;
		let checkName = await userWithName;
		if (userNow) {
			if (!checkUsername) {
				updateUser.username = userInfo.username;
			}
			if (!checkName) {
				updateUser.name = userInfo.name;
			}
			return await updateUser.save();
		} else return 0;
	},
	changePass: async (userInfo, username) => {
		//check username is exist
		let updateUser = await User.findOne({ username });
		if (updateUser) {
			if (bcrypt.compareSync(userInfo.password, updateUser.password)) {
				const saltRound = 10;
				const salt = bcrypt.genSaltSync(saltRound);
				updateUser.password = bcrypt.hashSync(userInfo.newpass, salt);
				return await updateUser.save();
			}
			return -1;
		}
		return 0;
	},
	resetPass: async (username) => {
		//check username is exist
		let updateUser = await User.findOne({ username });
		if (updateUser) {
			//create new password
			let newpass = '';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const charactersLength = characters.length;
			for (let i = 0; i < 18; i++)
				newpass += characters.charAt(Math.floor(Math.random() * charactersLength));
			const saltRound = 10;
			const salt = bcrypt.genSaltSync(saltRound);
			updateUser.password = bcrypt.hashSync(newpass, salt);
			const res = await updateUser.save();
			return {
				res,
				newpass
			}
		}
		return 0;
	},

	//========================>> USER's CART <<========================
	getCart: async (username) => {
		//check username is exist
		let user = await User.findOne({ username })
		return user.cart;
	},
	getCartDetail: async (username) => {
		//check username is exist
		let user = await User.findOne({ username }).populate({
			path: 'cart',
			populate: [{
				path: 'productId',
				model: 'product',
				populate: {
					path: 'colors',
					model: 'color'
				}
			}, {
				path: 'color',
				model: 'color',
			}]
		});
		let cart = JSON.parse(JSON.stringify(user.cart));

		//Cal totalPriceRaw on cart
		//Cal totalProducts on cart
		let totalPriceRaw = 0;
		let totalProducts = 0;
		if (cart && cart.length > 0) {
			for (let i = 0; i < cart.length; i++) {
				// console.log(cart[i])
				totalPriceRaw += cart[i].productId.price * cart[i].quantity;
				totalProducts += cart[i].quantity;
			}
		}

		return {
			cart,
			totalPriceRaw,
			totalProducts
		};
	},
	updateCart: async (cart, username) => {
		//check username is exist
		let updateUser = await User.findOne({ username });
		if (updateUser) {
			updateUser.cart = cart;
			return await updateUser.save();
		}
		return 0;
	},
}

