const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index",{allListing});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
const {title,description,image,price,location,country}=req.body;
        const newListing=new Listing({
        title,
        description,
        image:{url:image,filename:"placeholder.jpg"},
        price,
        location,
        country
    })
    newListing.owner=req.user._id; 
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;
    const listingData=req.body.listing;
    let listing=await Listing.findByIdAndUpdate(id,{...listingData});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}