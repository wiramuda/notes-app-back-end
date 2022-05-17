const InvariantError = require('../../exception/InvariantError');
const { UsersSchema } = require('./schema');

const validationResult = {
  validationUserPayload: (payload) => {
    const resultValidation = UsersSchema.validate(payload);

    if (resultValidation.error) {
      throw new InvariantError(resultValidation.error.message);
    }
  },
};

module.exports = validationResult;
