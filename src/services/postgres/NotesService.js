/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exception/authorizations');
const ClientError = require('../../exception/ClientError');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapDBToModel } = require('../../utils');

class NotesService {
  constructor(collaboratorService) {
    this._pool = new Pool();
    this._collaboratorService = collaboratorService;
  }

  async addNote({
    body, title, tags, credentialId,
  }) {
    const id = nanoid(16);
    const createAt = new Date().toISOString();
    const updateAt = createAt;

    const query = {
      text: 'insert into notes values($1, $2, $3, $4, $5, $6, $7) returning id',
      values: [id, title, tags, body, createAt, updateAt, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('catatan tidak berhasil ditambahkan');
    }
    return result.rows[0].id;
  }
  //left join collaborations as c on c.note_id = notes.id
  // or collaborations.user_id = $1 group by notes.id
  async getNotes(owner) {
    const query = {
      text: `select * from notes  
      where owner = $1 `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getNoteById(id) {
    const query = {
      text: `select *, users.username
      from notes as n
      inner join users on n.owner = users.id 
      where n.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, tags, body }) {
    const updateAt = new Date().toISOString();
    const query = {
      text: 'update notes set title = $1, tags = $2, body = $3, update_at = $4 where id = $5 returning id',
      values: [title, tags, body, updateAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new InvariantError('catatan gagal diperbaharui, catatan tidak ditemukan');
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async deleteNoteById(id) {
    const query = {
      text: 'delete from notes where id = $1 returning id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('catatan tidak ditemukan');
    }
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'select * from notes where id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Catatan tidak ditemukan.');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        this._collaboratorService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}
module.exports = NotesService;
