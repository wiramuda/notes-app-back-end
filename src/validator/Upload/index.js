const InvariantError = require('../../exception/InvariantError');

const { ImageHeaderSchema } = require('./schema'); 

const UploadValidator = {
    validateImageHeader: (headers) => {
        const validateResult = ImageHeaderSchema.validate(headers);
        if(validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    },
};

module.exports = UploadValidator;