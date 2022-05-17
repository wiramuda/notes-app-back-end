/* eslint-disable no-undef */
const InvariantError = require('../../exception/InvariantError');
const { postAuthPayloadSchema, putAuthPayloadSchema, deleteAuthPayloadSchema } = require('./schema');

const AuthenticationsValidator = {
  validatorPostSchema: (payload) => {
    const validatorPayload = postAuthPayloadSchema.validate(payload);
    if (validatorPayload.error) {
      throw new InvariantError(validatorPayload.error.message);
    }
  },
  validatorPutSchema: (payload) => {
    const validatorPutPayload = putAuthPayloadSchema.validate(payload);
    if (validatorPutPayload.error) {
      throw new InvariantError(validatorPutPayload.error.message);
    }
  },
  validatorDeleteSchema: (payload) => {
    const validatorDeletePayload = deleteAuthPayloadSchema.validate(payload);
    if (validatorDeletePayload.error) {
      throw new InvariantError(validatorDeletePayload.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
