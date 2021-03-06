var flash = require("connect-flash");
const bodyParser = require("body-parser")
const passPort = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy
const fs = require("fs");
module.exports = function(app){
  app.get("/", (req, res) => {
    res.render("index");
  })
  app.route("/login")
    .get((req, res) => {
      const messages = req.flash('error');
      const messagese = req.flash('error');
      res.render("login", {
        messages: messages,
        messagese: messagese

      })
    })
    .post(passPort.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/loginOk",
      failureFlash: true
    }))
  app.get("/loginOK", isLoggedIn,(req, res,user) => {
    res.render("loginOK",{user: req.user})
  })
  app.get("/private", (req, res) => {
    if (req.isAuthenticated()) {
      res.send("Welcome To Private")
    } else {
      res.send("Bạn Chưa Login")
    }
  })
  passPort.use(new LocalStrategy((username, password, done) => {
    fs.readFile("./userDb.json", (err, data) => {
      const db = JSON.parse(data)
      const userRecord = db.find((user) => {
        return user.usr == username
      })
      if (!userRecord) {
        return done(null, false, {
          message: "Username Không đúng"
        })
      } else if (userRecord.pwd == password) {
        return done(null, userRecord)
      } else {
        return done(null, false, {
          message: "Password Không đúng"
        })
      }
      // if(userRecord && userRecord.pwd == password){
      //   return done(null,userRecord)
      // }else{
      //
      //   //return done(null,false)
      //   return done(null,false,{ message: " P Không đúng" })
      // }
    })
  }))
  function isLoggedIn (req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/")
  }

  passPort.serializeUser((user, done) => {
    return done(null, user.usr)
  })
  passPort.deserializeUser((name, done) => {
    fs.readFile("./userDb.json", (err, data) => {
      const db = JSON.parse(data)
      const userRecord = db.find((user) => {
        return user.usr = name
      })
      if (userRecord) {
        return done(null, userRecord)
      } else {
        return done(null, false)
      }
    })
  })
}
