const User = require("../models/user");

module.exports.getSignup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({
            email,username
        });

        const registeredUser =  await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success",`Welcome ${username}`);
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","welcome back to HostleLink");
// this check is when we try to login from main page then our res.locals.redirectUrl object is empty so when it was empty then we have to redirect to ?/listings
// page 

        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.getLogout = (req,res,next)=>{
    req.logout((err)=>{
        return next(err);
    })
    req.flash("success","you are logged out!");
    res.redirect("/listings");
}