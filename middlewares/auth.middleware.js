const passport = require('passport');

module.exports = {
    adminAuth: (req, res, next) => {
        if (req.user.isAdmin)
            return next();
        res.json({ err: "You can not Access!" })
    },
}