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
		let updateUser = await User.findOne({ username });
		if (updateUser) {
			if (bcrypt.compareSync(userInfo.password, updateUser.password)) {
				updateUser.name = userInfo.name;
				return await updateUser.save();
			}
			return -1;
		}
		return 0;
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
}

