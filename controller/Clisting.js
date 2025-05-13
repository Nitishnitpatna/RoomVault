const Listing = require("../models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // from github https://github.com/mapbox/mapbox-sdk-js
const mapToken = process.env.map_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); // functionality which do some work for our geocoading

module.exports.index = async(req,res)=>{
    let hostels = await Listing.find();
    res.render("listings/index.ejs",{hostels});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path: "author"
        }
    })// this line is to give all information regarding the reviews
    .populate("owner"); // this line is to give all information regarding the ownwer
    if(!listings){
        req.flash("error","Listing doesn't exist");
        res.redirect("/listings");
    } 
    res.render("listings/show.ejs",{listings});
};


//////////////////////////////////// Use of geocoding heer
module.exports.addNew = async(req,res,next)=>{ 
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
        .send()
      

    let url = req.file.path;
    let filename = req.file.filename;
    let {title,description,image,price,location,country} = req.body; // WAY FIRST:
    let added =  await Listing.insertOne({
    title:title,
    description:description,
    image:{
        url:url,
        filename:filename
    },
    price:price,
    location:location,
    country:country,
    owner: req.user._id,
    geometry: response.body.features[0].geometry
})

console.log(added);

req.flash("success","New Listing created successfully!")
res.redirect("/listings");

};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id);
    if(!listings){
        req.flash("error","Listing doesn't exist");
        res.redirect("/listings");
    } 
    res.render("listings/edit.ejs",{listings});
};

module.exports.addEditedOne = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listings});

// Step 3 of image upload
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success","Updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    // console.log(deletedData);
    req.flash("success","listing is deleted successfully")
    res.redirect('/listings');
}