/*const express = require("express");
const bodyParser = require("body-parser");
const passPort = require("passport");
const fs = require("fs");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy // phương pháp chứng thực local
const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views","./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "mysecet",
                cookie: {
                  maxAge: 1000*60*5
                }})); // dùng session để ghi dử liệu ra ngoài và secret là bắt buộc phải có
app.use(passPort.initialize());
app.use(passPort.session());
app.get("/",(req,res)=>{
  res.render("index");
});
app.route("/login")
.get((req,res)=>{
  res.render("login")
})
.post(passPort.authenticate("local",{failureRedirect: "/login", successRedirect: "/loginOk"}))
app.get("/private",(req,res)=>{
  if(req.isAuthenticated()){
    res.send("Welcome To Private")
  }else{
    res.send("Bạn chưa login")
  }
})
app.get("/loginOK",(req,res)=>{
  res.send("Bạn đã login thành công");
})
passPort.use(new LocalStrategy(
  (username,password,done) => {
    fs.readFile("./userDb.json",(err,data)=>{
      const db = JSON.parse(data)
      const userRecord = db.find((user)=>{
        return user.usr == username;
      })
      if(userRecord && userRecord.pwd == password){
        return done(null,userRecord)
      }else{
        return done(null,false)
      }
    })
  }
))
passPort.serializeUser((user,done)=>{  // dùng để ghi ra cho cookie
  done(null,user.usr)
})
passPort.deserializeUser((name,done)=>{
  fs.readFile("./userDb.json",(err,data)=>{
    const db = JSON.parse(data)
    const userRecord = db.find((user)=>{
     return user.usr == name
    })
    if(userRecord){
      return done(null,userRecord)
    }else{
      return done(null,false)
    }
  })
})
app.listen(port, ()=>{
  console.log("Connect Done",port);
})*/
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const logint = require("./api/login/logint")
const loginfb = require("./api/loginfb/loginfb")
const Login = require("./api/models/loginModel")
const config = require("./config");
var flash = require("connect-flash");
const bodyParser = require("body-parser")
const passPort = require("passport");
const passPortFb = require("passport-facebook").Strategy
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy
const fs = require("fs");
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(flash());
app.use(session({
  secret: "mysecet",
  cookie: {
    maxAge: 1000*60*5
  }
}))
app.use(passPort.initialize());
app.use(passPort.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect(config.getDbconnectionString());
logint(app);
loginfb(app);


app.listen(port, () => {
  console.log("Connect Done", port);
})
