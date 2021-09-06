const passport = require('passport');
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const userService = require('../services/users.sevice');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN_KEY
    },
    (jwtPayload, done) => {
        // find the others information of user in database if needed
        return userService.getUserByUsername(jwtPayload.username).then(user => {
            if (user)
                return done(null, user);
            return done(null, false);
        }).catch(err => {
            return done(err, false);
        });
    }
));

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done) => {
        userService.getUserByUsername(username).then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'This username does not exists!'
                });
            }
            // compare password
            if (bcrypt.compareSync(password, user.password)) {
                // for security, send only username
                return done(null, {
                    username: user.username,
                    isAdmin: user.isAdmin
                });
            }
            else {
                return done(null, false, { message: 'Wrong password!' })
            }
        }).catch(err => {
            return done(err, false);
        })
    }
));