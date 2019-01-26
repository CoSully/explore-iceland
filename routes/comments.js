var express = require("express");
var router = express.Router({mergeParams: true});
var Location = require("../models/location");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

// comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find location by id
    Location.findById(req.params.id, function(err, location){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {location: location}); 
        }
    });
   
});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup location using ID
   Location.findById(req.params.id, function(err, location){
       if(err){
           console.log(err);
           res.redirect("/locations");
       } else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // save comment
                   comment.save();
                   location.comments.push(comment);
                   location.save();
                   req.flash("success", "Successfully added comment!");
                   res.redirect('/locations/' + location._id);
               }
           });
       }
   });
});

//EDIT comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Location.findById(req.params.id, function(err, foundlocation) {
        if(err || !foundlocation){
            req.flash("error", "location not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {location_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE comments route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/locations/" + req.params.id);
        }
    });
}); 

// DESTROY comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findOneAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment removed");
            res.redirect("/locations/" + req.params.id);
        }
    });
});

// middleware (exported to new Dir)

module.exports = router;