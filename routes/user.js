const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/Cuser.js");


router
    .route("/signup")
    .get(userController.getSignup)
    .post(wrapAsync(userController.postSignup)
)

router
    .route("/login")
    .get(userController.getLogin)
    .post(
        
        saveRedirectUrl,
        passport.authenticate("local",{ // this middleware to authenticate user if user exists in our database then go to async part ohterwise splash message
            failureRedirect: '/login', 
            failureFlash:true
     }),
        userController.postLogin
    )

// router.get("/signup",userController.getSignup);
// router.post("/signup",wrapAsync(userController.postSignup))

router.get("/login",userController.getLogin)
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{ // this middleware to authenticate user if user exists in our database then go to async part ohterwise splash message
        failureRedirect: '/login', 
        failureFlash:true
    }),
    userController.postLogin
);

router.get("/logout",userController.getLogout)

module.exports = router