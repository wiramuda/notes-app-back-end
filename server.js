require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// notes
const notes = require('./src/api/notes');// plugin
const NoteService = require('./src/services/postgres/NotesService');
const notesValidator = require('./src/validator/notes');

// user
const users = require('./src/api/users');// plugin users
const UserService = require('./src/services/postgres/userService');
const userValidator = require('./src/validator/users');

// auth
const authentications = require('./src/api/auth');// plugin authentications
const AuthService = require('./src/services/postgres/authService');
const AuthenticationsValidator = require('./src/validator/auth');
const TokenManager = require('./src/Tokenize/TokenManager');

// collaborations
const collaborations = require('./src/api/collaborations');
const CollaborationService = require('./src/services/postgres/ColaborationsService');
const validator = require('./src/validator/collaborations');

// exports
const _exports = require('./src/api/exports'); // untuk menghindari konflik dengan object global export
const ProducerService = require('./src/services/rabbitmq/producerService');
const ExportValidator = require('./src/validator/exports');

// uploads
const upload = require('./src/api/upload');
const UploadService = require('./src/services/Storage/StorageService');
const UploadValidator = require('./src/validator/Upload');

const init = async () => {
  const collaborationService = new CollaborationService();
  const notesService = new NoteService(collaborationService);
  const userService = new UserService();
  const authService = new AuthService();
  const uploadService = new UploadService(path.resolve(__dirname, 'api/uploads/file/images'));
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // plugin internal
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: notesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: userValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        notesService,
        validator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportValidator,
      },
    },
    {
      plugin: upload,
      options: {
        service: uploadService,
        validator: UploadValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
