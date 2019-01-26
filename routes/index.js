var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function(req, res){
   res.render("landing"); 
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    req.body.username;
    req.body.password;
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Let's go to Iceland! " + user.username);
            res.redirect("/locations");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic -w/middleware-
router.post("/login", passport.authenticate("local", {
    successRedirect: "/locations",
    failureRedirect: "/login"
}), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect("/locations");
});

module.exports = router;