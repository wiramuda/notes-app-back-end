const Joi = require('joi');

const NotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().required(),
});
// penggunaan destructuring untuk mengantisipasi penggunaan lebih dari satu schema
module.exports = { NotePayloadSchema };
