const ClientError = require('../../exception/ClientError');

class ExportsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
    }

    async postExportNotesHandler(request, h){
        try {
            await this._validator.validateExportsNotesPayload(request.payload);
            const message = {
                targetId: request.auth.credentials.id,
                email: request.payload.targetEmail,
            }

            await this._service.sendMessage('exports:notes', JSON.stringify(message));
            return h.response({
                status: 'success',
                message: 'Permintaan Anda dalam antrean',
            }).code(201);

        }catch(err) {
            if(err instanceof ClientError) {
                return h.response(err.toString()).code(err.statusCode);
            }

            console.log(err);
            return h.response(new ServerError('server sedang maintanace').toString()).code(500);
        }
    }
}

module.exports = ExportsHandler;
