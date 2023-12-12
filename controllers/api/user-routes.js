const router = require('express').Router();
const passport = require('../../utils/authentication-for-login.js');
const passport2 = require('../../utils/authentication-for-signup.js');
const  sessionSaveWithPromise = require('../../utils/session-promise-save.js');

// CREATE new user
router.post('/signup', passport2.authenticate('signup'), async (req, res) => {
    
    try {
        
        if(req.invalidUsername === "true"){

            res.redirect('/signup?invalidUsername=true');

        } else if(req.duplicateUser === "true"){

            res.redirect('/signup?duplicateUser=true');

        } else if(req.loggedInUser){

            req.session.loggedInUser = req.loggedInUser
            await sessionSaveWithPromise(req);

            res.redirect('/');
        }

    } catch (err) {

        console.log(err);
        res.status(500).json(err);
    }
});



// Logs the user into the website
router.post('/login', passport.authenticate('login'), async  (req, res) => {

    try {

        if(req.invalidCredentials === "true"){

            res.redirect('/login?valid=false');

        } else if(req.loggedInUser){

            req.session.loggedInUser = req.loggedInUser
            await sessionSaveWithPromise(req);

            res.redirect('/');
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

// Logout
router.get('/logout', (req, res) => {

  // When the user logs out, destroy the session
  res.set('Cache-Control', 'no-store');

  req.session.loggedInUser

    try{

        if (req.session.loggedInUser) {

            req.session.destroy(() => {
        
                res.redirect(301, '/login');
            });
        
        } else {
        
            res.redirect(301, '/login');
        }
  
    } catch(error) {

        console.log(error);
        res.status(500).json(error);
    }

});

module.exports = router;