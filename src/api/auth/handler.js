/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exception/ClientError');

class AuthHandler {
  constructor(authService, userService, tokenManager, authValidator) {
    this._service = authService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = authValidator;
    this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
    this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
    this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
  }

  async postAuthenticationsHandler(request, h) {
    try {
      await this._validator.validatorPostSchema(request.payload);
      const { username, password } = request.payload;
      const id = await this._userService.verifyUserCredintial(username, password);
      const accessToken = await this._tokenManager.generateAccessToken({ id });
      const refreshToken = await this._tokenManager.generateRefreshToken({ id });
      await this._service.addRefreshToken(refreshToken);
      const response = h.response({
        status: 'success',
        message: 'Authentications berhasil ditambahakan',
        data: {
          accessToken,
          refreshToken,
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
        console.error(error);
        return response;
      }
      // SERVER ERROR !!
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kesalahan pada server kami',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAuthenticationsHandler(request, h) {
    try {
      await this._validator.validatorPutSchema(request.payload);
      const { refreshToken } = request.payload;
      await this._service.verifyRefreshToken(refreshToken);
      const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = await this._tokenManager.generateAccessToken({ id });

      return ({
        status: 'success',
        message: 'Acess Token berhasil diperbaharui',
        data: {
          accessToken,
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

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAuthenticationsHandler(request, h) {
    try {
      await this._validator.validatorDeleteSchema(request.payload);
      const { refreshToken } = request.payload;
      await this._service.deleteRefreshToken(refreshToken);

      return ({
        status: 'success',
        message: 'Token berhasil dihapus',
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

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = AuthHandler;
