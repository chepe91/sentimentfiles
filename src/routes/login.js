const express = require("express");
const router = express.Router();


router.get('/', async (req, res) => {

  if (req.session.loggedin) {
    res.redirect('/home');
  } 
  else {
    res.render('auth/login');
  } 
});

router.post("/auth", (request, response) => {

  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    if (username.indexOf("@coppel.com") != -1) {

      console.log("login success");
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/home');
    } else {
        response.send('Incorrect Username and/or Password!');
    }           
    response.end();
  }

});

router.get('/logout', function(req, res, next) {

  req.session.loggedin = false;
  req.session.username = "";
  res.redirect('/');
});


module.exports = router;