const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/Listing.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/HostelLink';
Main().then(()=>{
    console.log("connection made");
}).catch(err =>{
    console.log(err);
})
async function Main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
        await listing.deleteMany({});
        initData.data = initData.data.map((obj)=>({
            ...obj,
            owner: "67fca9cd33b3339597f43610"
        }));
        await listing.insertMany(initData.data);
        console.log("data was initialized");

}

initDB();