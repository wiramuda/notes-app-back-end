/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('notes', {
    id: {
      type: 'VARCHAR(50)',
      primarykey: true,
      unique: true,
    },
    title: {
      type: 'TEXT',
      notnull: true,
    },
    tags: {
      type: 'TEXT[]',
      notnull: true,
    },
    body: {
      type: 'TEXT',
      notnull: true,
    },
    create_at: {
      type: 'TEXT',
      notnull: true,
    },
    update_at: {
      type: 'TEXT',
      notnull: true,
    },
  });
};

// eslint-disable-next-line no-unused-vars
exports.down = (pgm) => {
  pgm.dropTable('notes');
};
