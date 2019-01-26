// all the middleware goes here
var middlewareObj = {};
var Location = require("../models/location");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Location.findById(req.params.id, function(err, foundLocation){
            if(err || !foundLocation){
                req.flash("error", "Location not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if(foundLocation.author.id.equals(req.user._id)){
                    next(); 
                } else {
                    req.flash("error", "Permission denied")
                    res.redirect("back");
                }
            }
        }); 
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next(); 
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        }); 
    } else {
        req.flash("error", "You need to be logged to do this");
        res.redirect("back");
    }
};   

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

module.exports = middlewareObj;