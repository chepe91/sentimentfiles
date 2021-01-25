
const express = require("express");
const router = express.Router();


router.get('/home', async (req, res) => {
    if (req.session.loggedin) {
        res.render('home/home');
    } 
    else{
        res.redirect('/');
    }
});

module.exports = router;