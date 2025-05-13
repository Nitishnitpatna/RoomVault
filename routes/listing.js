const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/Clisting.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


router
  .route("/")
  .get(wrapAsync(listingController.index)
    )
  .post(
    isLoggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.addNew)
)


router.get("/new",isLoggedIn,listingController.renderNewForm);


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.addEditedOne)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    )
// route.get("/",wrapAsync(listingController.index));
// Create new (New Route)


// Showw Listing
// route.get("/:id",wrapAsync(listingController.showListing));

// Add new Listing
// route.post("/",validateListing,isLoggedIn,wrapAsync(listingController.addNew))

//// Update &  edit
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);
// route.put(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.addEditedOne));

// Delete
// router.delete(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.deleteListing)
// );



module.exports = router;