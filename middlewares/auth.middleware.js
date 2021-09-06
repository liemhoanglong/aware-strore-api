const passport = require('passport');

module.exports = {
    userAuth: passport.authenticate('jwt', { session: false }),
    adminAuth: (req, res, next) => {
        if (req.user.isAdmin)
            return next();
        res.status(401).json({ err: "You can not Access!" })
    },
}