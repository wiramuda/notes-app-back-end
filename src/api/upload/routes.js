const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/images',
        options: {
            handler: handler.postUploadImage,
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
            }
        }
    },
    {
        method: 'GET',
        path: '/upload/images/{params*}',
        options: {
            handler: {
                directory: {
                    path: `/home/wiramuda/Documents/js/web Development/Back-End-Fundamental/notes-app-back-end/api/uploads/file/images/`,
                }
            }
        },
    },
];

module.exports = routes;