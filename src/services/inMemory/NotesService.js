const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');

/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-unused-vars
class NoteService {
  constructor() {
    this._notes = [];
  }

  // eslint-disable-next-line class-methods-use-this
  addNote({ title, tags, body }) {
    const id = nanoid(16);
    const createAt = new Date().toISOString();
    const updateAt = createAt;

    const newNote = {
      title, tags, body, id, createAt, updateAt,
    };
    this._notes.push(newNote);
    const isSuccesful = this._notes.filter((item) => item.id === id).length > 0;
    if (!isSuccesful) {
      throw new InvariantError('catatan tidak berhasil ditambahkan');
    }

    return id;
  }

  getNotes() {
    return this._notes;
  }

  getNoteById(id) {
    const note = this._notes.filter((item) => item.id === id)[0];
    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return note;
  }

  editNoteById(id, { title, tags, body }) {
    const noteIndex = this._notes.findIndex((item) => item.id === id);
    const updateAt = new Date().toISOString();
    if (noteIndex === -1) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    this._notes[noteIndex] = {
      ...this._notes[noteIndex],
      title,
      tags,
      body,
      updateAt,
    };
  }

  deleteNoteById(id) {
    const noteIndex = this._notes.findIndex((item) => item.id === id);
    if (noteIndex === -1) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    this._notes.splice(noteIndex, 1);
  }
}
module.exports = NoteService;
