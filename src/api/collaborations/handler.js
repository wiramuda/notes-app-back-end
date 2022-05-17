const ClientError = require('../../exception/ClientError');

/* eslint-disable no-underscore-dangle */
class CollaborationsHandler {
  constructor(collabService, noteService, validator) {
    this._collabService = collabService;
    this._validator = validator;
    this._noteService = noteService;
    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationsPayload(request.payload);
      const { id: credentials } = request.auth.credentials;
      const { noteId, userId } = request.payload;
      await this._noteService.verifyNoteOwner(noteId, credentials);
      const collaborationsId = await this._collabService.addCollaboration(noteId, userId);
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationsId,
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
        return response;
      }
      // SERVER ERROR!!
      const response = h.response({
        status: 'fail',
        message: 'Maaf Server Kami sedang Bermasalah',
      });
      response.code(error.statusCode);
      console.error(error);
      return response;
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationsPayload(request.payload);
      const { id: credentials } = request.auth.credentials;
      const { noteId, userId } = request.payload;
      await this._noteService.verifyNoteOwner(noteId, credentials);
      await this._collabService.deleteCollaboration(noteId, userId);
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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
        return response;
      }
      // SERVER ERROR!!
      const response = h.response({
        status: 'fail',
        message: 'Maaf Server Kami sedang Bermasalah',
      });
      response.code(error.statusCode);
      console.error(error);
      return response;
    }
  }
}
module.exports = CollaborationsHandler;
