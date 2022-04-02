/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  tags,
  body,
  create_at,
  update_at,
  username,
}) => ({
  id,
  title,
  body,
  tags,
  createAt: create_at,
  updateAt: update_at,
  username,
});

module.exports = { mapDBToModel };
