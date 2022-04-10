const fs = require('fs');

class StorageService{
    #folder;
    constructor(folder) {
        this.#folder = folder;
        if(!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        };
    };

    writeFile(file, meta) {
        const filename = +new Date() + meta.filename;
        const path = `${this.#folder}/${filename}`;

        const fileStream = fs.createWriteStream(path);

        return new Promise((resolve, rejects) => {
            fileStream.on('error', (error) => console.log(error));
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
    };
};


const s = new StorageService('string');
console.log(s._folder);

module.exports = StorageService;