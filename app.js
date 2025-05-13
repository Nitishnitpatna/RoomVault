if(process.env.NODE_ENV != "production"){ // till our code is not at a level of production we will use the dotenv file
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");


// confeguring the strategies for passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrl = process.env.ATLASDB_URL;
Main().then(()=>{
    console.log("connection made");
}).catch(err =>{
    console.log(err);
})
async function Main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({  //Multiple option that we can use within it some are
    mongoUrl: dbUrl,

    // Advance options
    crypto:{
        secret: process.env.secret
    },

    // 3rd option: touchAfter :- it is basically the interval between the session updates
    touchAfter: 24*60*60,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionConfig = {
    store, // mongo session info 
    secret: process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, // 7 days
        maxAge: 7*24*60*60*1000,
        httpOnly:true, // only accessible by the web server
    }
};



app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true})); // read






// app.get("/",(req,res)=>{
//     res.send("Done");
// })

app.use(session(sessionConfig)); // session middleware
app.use(flash()); // flash middleware


// For initializing strategies
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); // Flash message to be displayed on the next request
    res.locals.error = req.flash("error"); // Flash message to be displayed on the next request 
    res.locals.currUser = req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser =  new User({
        email: "demouser@gmail.com",
        username: "demoUser"
    })
    let registeredUser = await User.register(fakeUser,"fakeUser123");
    res.send(registeredUser);
})

app.use("/",userRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
// practise route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found")); 
})


// error handling :- normal in which we can't able to sen't our own statuscode and message
// app.use((err,req,res,next)=>{
//     res.send("something went wrong");
// })

// After defining our ExpressError class in utils folder now we can deconstruct our error handling middleware which throw our own defined statuscode and message
app.use((err,req,res,next)=>{
    let {statusCode = 500, message="Something went wrong"} = err;
    res.render("error.ejs",{message});
    // res.status(status).send(message);
})
app.listen(8080,()=>{
    console.log("server is listen at port 8080");
})