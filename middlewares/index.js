// error
const BadRequest = require("./error/badrequest"); // 400 error
const Unauthorized = require("./error/unauthorized"); // 401 error
const Forbidden = require("./error/forbidden"); // 403 error
const NotFound = require("./error/notfound"); // 404 error
const Conflict = require("./error/conflict"); // 409 error

// user
const Identification = require("./user/identification");

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  Identification,
};
