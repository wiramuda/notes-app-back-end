const Joi = require('joi');

const ExportsNotesPayloadSchema = Joi.object({
    targetEmail: Joi.string().required().email({tlds:true})
});

module.exports = ExportsNotesPayloadSchema;