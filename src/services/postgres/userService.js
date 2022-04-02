/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthenticationsError = require('../../exception/authenticationsError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // TODO: Verifikasi username yang belum terdaftar;
    await this.verifyNewUserName(username);
    // TODO: bila verifikasi lolos maka masukkan user baru ke database;
    const id = `user-${nanoid(16)}`;
    const hastPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'insert into users values($1,$2,$3,$4) returning id',
      values: [id, username, hastPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Users gagal ditambahkan.');
    }
    return result.rows[0].id;
  }

  async verifyNewUserName(username) {
    const query = {
      text: 'select * from users where username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rowCount !== 0) {
      throw new InvariantError('Gagal menambahkan user, Username sudah digunakan.');
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'select * from users where id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('user tidak ditemukan');
    }
    return result.rows[0];
  }

  async verifyUserCredintial(username, password) {
    const query = {
      text: 'select id,password from users where username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationsError('username yang Anda berikan salah');
    }
    const { id, password: hastPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hastPassword);
    if (!match) {
      throw new AuthenticationsError('password yang Anda berikan salah');
    }
    return id;
  }

  async getUserByUsername(username) {
    const query = {
      text: 'select id, username, fullname from users where username like $1',
      values: [`%${username}%`],
    };
    const result = this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = UserService;
