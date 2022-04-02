/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql("insert into users(id, username, password, fullname) values ('old_notes', 'old_notes', 'old_notes', 'old_notes' ) ");
  // memnngubah nilai owner pada note yang ownernya bernilai null
  pgm.sql("update notes set owner = 'old_notes' where owner = NULL");

  // memberikan constraint foreign key pada owner terhadap kolom id dari table users
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  pgm.sql("update notes set owner = NULL where owner = 'old_notes'");

  pgm.sql("delete from users where id = 'old_notes'");
};
