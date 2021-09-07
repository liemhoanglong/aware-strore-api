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
	update: async (userInfo) => {
		//check username is exist
		let updateUser = await User.findOne({ username: userInfo.username });
		if (updateUser) {
			if (bcrypt.compareSync(userInfo.password, updateUser.password)) {
				updateUser.name = userInfo.name;
				//password
				return await updateUser.save();
			} else {
				return -1;
			}
		}
		return 0;
	},
}

