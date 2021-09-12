const passport = require('passport');
const jwt = require('jsonwebtoken');

const userService = require('../services/users.sevice');
const mailer = require('../utils/mailer');

module.exports = {
    getAll: async (req, res) => {
        const users = await userService.getAll();
        res.json({ users });
    },
    getProfile: async (req, res) => {
        res.json({
            username: req.user.username,
            isAdmin: req.user.isAdmin,
            isBlock: req.user.isBlock,
            isLocalLogin: req.user.isLocalLogin,
            avatar: req.user.avatar,
            cart: req.user.cart,
        });
    },
    login: async (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).json({
                    err: info.message,
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.status(400).json({
                        err
                    });
                }
                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_KEY);
                return res.json({
                    user,
                    token,
                    msg: 'Access granted'
                });
            });
        })(req, res);
    },
    adminLogin: async (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).json({
                    err: info.message,
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.status(400).json({
                        err
                    });
                }
                // generate a signed json web token with the contents of user object and return it in the response
                if (!user.isAdmin)
                    return res.status(400).json({
                        err: 'Access denied',
                    });
                const token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_KEY);
                return res.json({
                    user,
                    token,
                    msg: 'Access granted'
                });
            });
        })(req, res);
    },
    register: async (req, res) => {
        const { username, name, password } = req.body;
        // check params
        if (!username || !name || !password) {
            res.status(400).json({
                err: 'Please enter all required fields'
            });
        }
        const currentUser = await userService.getUserByUsername(username);
        if (currentUser) {//check username is exist
            return res.status(400).json({ err: 'This username already exists!' });
        }
        try {
            const user = await userService.create(username, name, password);
            res.json({ msg: 'Register success!', username: user.username });
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: 'Can not create new user!' });
        }
    },
    update: async (req, res) => {
        try {
            const user = await userService.update(req.body, req.user.username);
            if (user === 0)
                res.status(400).json({ err: 'This username does not exists!' });
            else if (user === -1)
                res.status(400).json({ err: 'Wrong password' });
            else
                res.json({ user });
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: 'Can not update user!' });
        }
    },
    changePass: async (req, res) => {
        try {
            const user = await userService.changePass(req.body, req.user.username);
            if (user === 0)
                res.status(400).json({ err: 'This username does not exists!' });
            else if (user === -1)
                res.status(400).json({ err: 'Wrong password' });
            else
                res.json({ user });
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: 'Can not change password!' });
        }
    },
    forgotPass: async (req, res) => {
        try {
            const user = await userService.resetPass(req.body.username);
            if (user === 0)
                res.status(400).json({ err: 'This username does not exists!' });
            else {
                mailer.sendPass(req.body.username, user.newpass);
                res.json({ user });
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: 'Can not reset password!' });
        }
    },

    //========================>> USER's CART <<======================== 
    getCart: async (req, res) => {
        const { cart, totalPriceRaw } = await userService.getCartDetail(req.user.username);
        res.json({ cart, totalPriceRaw });
    },
    updateCart: async (req, res) => {
        try {
            const user = await userService.updateCart(req.body.cart, req.user.username);
            if (user === 0)
                res.status(400).json({ err: 'This username does not exists!' });
            else
                res.json({ user });
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: 'Can not update userCart!' });
        }
    },
}