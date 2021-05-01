const {
  addNoteHandeler,
  getAllNotesHandler, getNoteByIdHandler, edtNoteByIdHandler, deleteNoteByIdHandler,
} = require('./handler');

const routes = [{
  method: 'POST',
  path: '/notes',
  handler: addNoteHandeler,
},
{
  method: 'GET',
  path: '/notes',
  handler: getAllNotesHandler,
},
{
  method: 'GET',
  path: '/notes/{id}',
  handler: getNoteByIdHandler,
},
{
  method: 'PUT',
  path: '/notes/{id}',
  handler: edtNoteByIdHandler,
},
{
  method: 'DELETE',
  path: '/notes/{id}',
  handler: deleteNoteByIdHandler,
}];

module.exports = routes;
