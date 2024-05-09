class BadRequest extends Error {
  status = 400;
  constructor(message) {
    super(message);
    this.name = "BadRequest";
    this.data = null;
  }
}

class Unauthorized extends Error {
  status = 401;
  constructor(message) {
    super(message);
    this.name = "Unauthorized";
    this.data = null;
  }
}

class Forbidden extends Error {
  status = 403;
  constructor(message) {
    super(message);
    this.name = "Forbidden";
    this.data = null;
  }
}

class NotFound extends Error {
  status = 404;
  constructor(message) {
    super(message);
    this.name = "NotFound";
    this.data = null;
  }
}

class Conflict extends Error {
  status = 409;
  constructor(message) {
    super(message);
    this.name = "Conflict";
    this.data = null;
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
};
