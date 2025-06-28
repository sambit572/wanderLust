const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("app has started");
});

//index.ejs
app.get("/listings",async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index",{allListing});
})

//New route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//create route
app.post("/listings",async(req,res)=>{
    const {title,description,image,price,location,country}=req.body;
    const newListing=new Listing({
        title,
        description,
        image:[{url:image,filename:"placeholder.jpg"}],
        price,
        location,
        country
    });
    await newListing.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listingData=req.body.listing;
    if(req.body.listing.image&& !Array.isArray(listingData.image)){
        listingData.image=[listingData.image]
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListing",async(req,res)=>{
//     const sampleListing=new Listing({
//         title:"my home",
//         description:"By the Beach",
//         price:4000,
//         location:"Bhadrak",
//         country:"india"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// })

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})