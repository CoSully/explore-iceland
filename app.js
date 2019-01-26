var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Location     = require("./models/location"),
    seedDB         = require("./seeds"),
    User           = require("./models/user"),
    Comment        = require("./models/comment");

// requiring routes    
var commentRoutes    = require("./routes/comments"),
    locationRoutes = require("./routes/locations"),
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); -- no seed the database

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "The sky is blue",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// express router
app.use(indexRoutes);
app.use("/locations", locationRoutes);
app.use("/locations/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});