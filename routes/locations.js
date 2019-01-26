var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var middleware = require("../middleware/index");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    Location.find({}, function(err, alllocations){
       if(err){
           console.log(err);
       } else{
           res.render("locations/index",{locations:alllocations});
       }
    });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
     // get data from form and add to campgrounds array
     var name = req.body.name;
     var distance = req.body.distance;
     var image = req.body.image;
     var desc = req.body.description;
     // adding author info to new campground
     var author = {
         id: req.user._id,
         username: req.user.username
     };
     var newLocation = {name: name, distance: distance, image: image, description: desc, author: author};
     // create a new campground and save to DB
     Location.create(newLocation, function(err, newlyCreated){
         if(err){
             console.log(err);
         } else{
             res.redirect("/locations");
         }
     });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("locations/new");   
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    // find the campground with provided ID
    Location.findById(req.params.id).populate("comments").exec(function(err, foundLocation){
       if(err || !foundLocation){
           req.flash("error", "Location not found");
           res.redirect("back");
       } else {
           res.render("locations/show", {location: foundLocation});
       }
    });
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation){
        if(err){
            req.flash("error", "error occured!");
        } else{
        res.render("locations/edit", {location: foundLocation});
        }
    }); 
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLocation){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Location.findOneAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations");
        }
    });
});

// middleware (exported to new Dir)

module.exports = router;