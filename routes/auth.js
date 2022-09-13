const express = require ('express')
const passport = require('passport')
const router = express.Router()

//Authenticate with google
router.get ('/auth/google', passport.authenticate('google', { scope: ['profile'] }) ) 

//Google Auth Callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});

//Logout User
router.get('/auth/logout', (req,res) => {
  req.logout((error) => {
    if (error) {{return next(error)}}
    res.redirect('/')
  });  
});

module.exports = router