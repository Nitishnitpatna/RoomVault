const Listing = require("./models/Listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"   ",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// converting schema.js listingSchema into middleware
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body.listing);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//  converting schema.js reviewSchema into middleware
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
                
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    // console.log(review);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    // if(!review.author.equals(res.locals.currUser._id))  {
    //     req.flash("error","you are not the owner of this review")
        // return res.redirect(`/listings/${id}`);
    // }
    next();
}