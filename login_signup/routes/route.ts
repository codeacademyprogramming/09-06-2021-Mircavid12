import express from 'express';
import passport from 'passport';
import User from "../models/user";
import bodyParser from "body-parser"
import LocalStrategy from "passport-local"
const app = express();

mongoose.connect("mongodb://localhost/auth_demo");
app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());

app.get("/userprofile",isLoggedIn ,(req,res) =>{
    res.render("userprofile");
})
//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/userprofile",
    failureRedirect:"/login"
}),function (req, res){
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,phone:req.body.phone,telephone: req.body.telephone}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT ||3000,()=> (err)=> {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
});