const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  verison: '1.0.0',
  register: async (server, { collaborationService, notesService, validator }) => {
    const colaborationHandler = new CollaborationsHandler(
      collaborationService, notesService, validator,
    );
    server.route(routes(colaborationHandler));
  },
};
