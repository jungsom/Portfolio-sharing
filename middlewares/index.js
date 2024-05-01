// error
const BadRequest = require("./error/badrequest"); // 400 error
const Unauthorized = require("./error/unauthorized"); // 401 error
const NotFound = require("./error/notfound"); // 404 error

module.exports = { BadRequest, Unauthorized, NotFound };
