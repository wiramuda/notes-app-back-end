const {ExportsNotesPayloadSchema} = require('./schema');
const InvarriantError = require('../../exception/InvariantError');

const ExportValidator = {
    validateExportsNotesPayload: (payload) => {
        const validationResult = ExportsNotesPayloadSchema.validate(payload);
        
        if(validationResult.error) {
            throw new InvarriantError(validationResult.error.message);
        }
    }
}

module.exports = ExportValidator;