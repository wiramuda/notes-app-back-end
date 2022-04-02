const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'not Found Error';
  }
}
module.exports = NotFoundError;
