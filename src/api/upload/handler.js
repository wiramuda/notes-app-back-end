const ClientError = require("../../exception/ClientError");

class UploadHandler{
    #service
    #validator
    constructor(service, validator) {
        this.#service = service;
        this.#validator = validator;

        this.postUploadImage = this.postUploadImage.bind(this);
    }

    async postUploadImage(request, h){
        try{
            const { data } = request.payload;
            this.#validator.validateImageHeader(data.hapi.headers);
            const filename = await this.#service.writeFile(data ,data.hapi);

            return h.response({
                status: 'sucess',
                data: {
                    fileLoaction: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
                },
            }).code(201);


        }catch(error){
            if(error instanceof ClientError) {
                return h.response({
                    status: 'fail',
                    message: error.message,
                }).code(error.statusCode)
            }
            console.log(error);
            return h.response({
                status: 'error',
                message: 'maaf, terjadi kegagalan pada server',
            }).code(500);
        }
    }
}

module.exports = UploadHandler;