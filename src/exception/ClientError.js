class ClientError extends Error {
  constructor(message, statuscode = 400) {
    super(message);
    this.statusCode = statuscode;
    this.name = 'Client Error';
  }
}
module.exports = ClientError;
