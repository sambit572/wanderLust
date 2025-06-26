const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        require:true 
    },
    description:String,
    image:[
        {
        filename:String,
        url:{
            type:String,
        default:"https://unsplash.com/photos/silhouette-of-people-on-beach-during-sunset-iRCt75bEBps",
        set:(v)=>v===""?"https://unsplash.com/photos/silhouette-of-people-on-beach-during-sunset-iRCt75bEBps":v,
        }
    }],
    price:Number,
    location:String,
    country:String
});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;