const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res)=>{
let {error}=listingSchema.validate(req.body);
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);     
} else {
    next();
}
};

//index.ejs
router.get("/",wrapAsync(async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index",{allListing});
}))

//New route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
const {title,description,image,price,location,country}=req.body;
        const newListing=new Listing({
        title,
        description,
        image:[{url:image,filename:"placeholder.jpg"}],
        price,
        location,
        country
    })
    await newListing.save();
    res.redirect("/listings");
    
}));

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res,next)=>{
    
    let {id}=req.params;
    const listingData=req.body.listing;
    if(req.body.listing.image&& Array.isArray(listingData.image)){
        listingData.image=listingData.image;
    }
    await Listing.findByIdAndUpdate(id,{...listingData});
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;