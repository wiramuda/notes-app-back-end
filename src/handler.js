const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandeler = (request, h) => {
  const { title, tags, body } = request.payload; // mengambil request dari client
  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;
  const newNotes = {
    title, tags, body, id, createAt, updateAt,
  };
  notes.push(newNotes);

  const success = notes.filter((note) => note.id === id).length > 0;

  if (success) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'failed',
    massage: 'Catatan Gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    massage: 'Catatan Tidak ditemukan',
  });
  response.code(404);
  return response;
};

const edtNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    massage: 'id tidak dapat ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Catatan dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addNoteHandeler,
  getAllNotesHandler,
  getNoteByIdHandler,
  edtNoteByIdHandler,
  deleteNoteByIdHandler,
};// object literal
