const InvariantError = require('../../exception/InvariantError');
const { collaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validateCollaborationsPayload: (payload) => {
    const validationsResult = collaborationPayloadSchema.validate(payload);
    if (validationsResult.error) {
      throw new InvariantError(validationsResult.error.message);
    }
  },
};
module.exports = CollaborationsValidator;
