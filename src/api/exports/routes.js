const routes = (handler) => [ 
    {
        path: '/exports/notes',
        method: 'POST',
        options: {
            handler: handler.postExportNotesHandler,
            auth: 'notesapp_jwt',
        }
    }
]

module.exports = routes;