const mongoose = require("mongoose");
const configValues = require("./config.json")
module.exports = {
  getDbconnectionString: () => {
    return `mongodb://${configValues.username}:${configValues.password}@ds161175.mlab.com:61175/loginfb`
  }
}
