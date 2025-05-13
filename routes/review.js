const express = require("express");
const route = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const Listing = require("../models/Listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
// const review = require("../models/review.js");
const reviewController = require("../controller/Creview.js");
// co


// review routes

    //  Reviews
// Post request
route.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.addReview));
        
//    Delete review route
route.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = route;