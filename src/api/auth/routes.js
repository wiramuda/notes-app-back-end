const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationsHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationsHandler,
  },
  {
    method: 'DELETE',
    path: '/authtentications',
    handler: handler.deleteAuthenticationsHandler,
  },
];

module.exports = routes;
