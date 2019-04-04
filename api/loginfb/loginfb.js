const Login = require("../models/loginModel")
const bodyParser = require("body-parser")
const passPort = require("passport");
const session = require("express-session");
const PassPortFb = require("passport-facebook").Strategy
module.exports = function(app){
  app.get("/fb",isLoggedIn,(req,res,user)=>{
    res.render("indexfb",{user: req.user})
  })
  app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/loginfb');
  console.log("Logout Success")
});
  app.get("/loginfb",(req,res)=>{
    res.render("loginfb")
  })
  app.get("/auth/fb",passPort.authenticate("facebook",{scope: ["email"]}))
  app.get("/auth/fb/cb", passPort.authenticate("facebook",{
    failureRedirect: "/loginfb" ,successRedirect: "/fb" ,isLoggedIn: null
  }))
  passPort.use(new PassPortFb(
    {
        clientID:"2764081110484053",
        clientSecret:"53b69ce0ecae58c41cb9e32d8ac6a4c2",
        callbackURL:"https://68e3d3f2.ngrok.io/auth/fb/cb",
        profileFields: ["email", "gender", "locale","address","birthday","link","displayName"]
    },
    (accessToken,refreshToken,profile,done)=>{
      const username= profile._json.name.split("").join("")
      console.log("Tên:",username);
      console.log(profile);
      Login.findOne({id: profile._json.id},(err,user)=>{
        if(err) return done(err)
        if(user) return done(null,user)
        const newUser = new Login(
          {
          username : username,
          id:profile._json.id,
          name:profile._json.name,
          email:profile._json.email
        },
      )
        newUser.save((err)=>{
          return done(null,newUser)
        })
      })
    }
))
passPort.serializeUser((user,done)=>{
  done(null,user.id)
})
passPort.deserializeUser((id,done)=>{
  Login.findOne({id:id},(err,user)=>{
    done(null,user)
  })
})


}
function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/loginfb")
}
