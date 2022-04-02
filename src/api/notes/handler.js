// --------------PENTING------------------
// inisialisasi untuk menampung id dari params harus sama dengan nama routesnya
// contoh jika di path routes notes/{id} maka pada handler penampung nilai idnya
// juga harus id.
//------------------------------------

const ClientError = require('../../exception/ClientError');

/* eslint-disable no-underscore-dangle */
class getNotesHandler {
  constructor(service, validator) {
    this._service = service; // penggunaan underscore diawal sebagai lingkup privat secara konvensi
    this._validator = validator;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = 'untitle', tags, body } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const noteId = await this._service.addNote({
        title, tags, body, credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        const { id: credentialId } = request.auth.credentials;
        return response;
      }
      // server error
      const response = h.response({
        status: 'fail',
        message: 'Maaf Terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getNotesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    console.log(credentialId);
    const notes = await this._service.getNotes(credentialId);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request, h) {
    try {
      const { noteId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteAccess(noteId, credentialId);
      const note = await this._service.getNoteById(noteId);
      return h.response({
        status: 'success',
        data: {
          note,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'fail',
        message: 'Maaf Terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { noteId } = request.params;
      const { title, tags, body } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteAccess(noteId, credentialId);
      await this._service.editNoteById(noteId, { title, tags, body });
      return {
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'fail',
        message: 'Maaf Terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteNoteByIdHandler(request, h) {
    try {
      const { noteId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(noteId, credentialId);
      await this._service.deleteNoteById(noteId);
      return ({
        status: 'success',
        message: 'Catatan Berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'fail',
        message: 'Maaf Terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = getNotesHandler;
