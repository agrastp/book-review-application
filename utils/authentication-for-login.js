//Authentication at login/validates hashed password
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const crypto = require('crypto');
const {hashSinglePassword} = require('./hash-password.js');

//I, Gabriel, used code from the following URL to use Passport:  https://www.passportjs.org/packages/passport-local/
passport.use('login', new LocalStrategy(
    
    {
        passReqToCallback: true
    },
    
    /*This function validates the user's username and password.  If they match a record in the database,
    the user is logged in.  If not, the user will be kicked back to the login page.*/
    async function(req, username, password, done) {

        try {

            req.res.set('Cache-Control', 'no-store');

            const user = await User.findOne({ where: { username: username } });

            if (!user) {

                req.res.redirect('/login?valid=false');

              return done(null, false, { message: 'Incorrect username or password' });
            }

            //I, Gabriel, also used code from this URL to use Passport: https://www.passportjs.org/tutorials/password/verify/
            let hashedPassword = await hashSinglePassword(password, user.salt, "authentication");

            let validPassword = (crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword));

            if (!validPassword) {

                req.res.redirect('/login?valid=false');

                return done(null, false, { message: 'Incorrect username or password' });
            }

            req.loggedInUser = user; 

            return done(null, user);

        } catch (err) {

            console.log(err);
        }
    }         
));

module.exports = passport;





