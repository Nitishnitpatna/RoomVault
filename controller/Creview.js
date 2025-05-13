const Review = require("../models/review");
const Listing = require("../models/Listing");

module.exports.addReview = async(req,res)=>{
    // Error come in the page with this route reason :- as ID does't come it come as undefined as no id parameter is coming............\\ as req.param stops id parameter in app.js file itself so to merge the parameter externally use mergeparam
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save(); // save method is used to save data in existing database
    await listing.save();// save method is used to save data in existing database
    req.flash("Success","New review created");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  // here i use this method as i just want to update the listing i.e to delete id of review by use of $pull operator
    // $pull : is used to match the things then delete it if it get matched
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};