const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const loginSchema = new Schema({
  id : String,
  name: String,
  email:String
})
const Login = mongoose.model("Login",loginSchema);
module.exports = Login;
