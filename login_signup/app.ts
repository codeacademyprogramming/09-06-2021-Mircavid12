import express from "express";

const app = express();

mongoose.connect("mongodb://localhost/auth_demo");
app.use(require("express-session")({
secret:"Any normal Word",//decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

app.listen(process.env.PORT || 3000,()=>(err)=> {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started At Port 3000");
  }
});
