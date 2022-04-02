/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class AuthService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'insert into authentications values($1)',
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'select token from authentications where token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('refresh Token tidak ditemukan');
    }
  }

  async deleteRefreshToken(refreshToken) {
    await this.verifyRefreshToken(refreshToken);
    const query = {
      text: 'delete from authentications where token = $1',
      values: [refreshToken],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthService;
