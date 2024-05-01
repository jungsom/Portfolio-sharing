class NotFound extends Error {
  status = 404;
  constructor(message) {
    super(message);
    this.name = "NotFound";
  }
}

module.exports = NotFound;
