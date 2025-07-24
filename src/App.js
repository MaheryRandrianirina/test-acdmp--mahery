const { Command } = require('commander')
const program = new Command()
const { TITLE, VERSION, DESCRIPTION, COMMAND_NAME, COMMAND_DESCRIPTION } = require('./utils/constants')
const fs = require('fs')
const { unzipSync } = require('fflate')
const { PdfReader } = require('pdfreader')
const parseDDMMYYYY = require('./utils/date')

class App {

    // files inside the zip file
    #filesInTheZip = [
        "Attestation_Fiscale.pdf",
        "DC1.pdf",
        "Kbis.pdf",
        "Note_Interne.pdf"
    ]

    run(){
        program
            .name(TITLE)
            .description(DESCRIPTION)
            .version(VERSION)

        program.command(`${COMMAND_NAME} <zipPath>`)
            .description(COMMAND_DESCRIPTION)
            .action(this.#actionFromCommand.bind(this))

        program.parse(process.argv)

    }

    async #actionFromCommand(zipPath) {
        if (!fs.existsSync(zipPath)) {
            console.error(`❌ Le fichier "${zipPath}" n'existe pas.`)
            return
        }

        try {
            const fileBuffer = fs.readFileSync(zipPath)
            const files = unzipSync(fileBuffer)

            // verify if the zip is missing files
            const missingFiles = this.#filesInTheZip.filter(file => !Object.keys(files).includes(file));
            if (missingFiles.length > 0) {
                console.warn(`⚠️  Attention : Le fichier ZIP ne contient pas les fichiers suivants : ${missingFiles.join(', ')}.`);
            }

            /**
             * array representing the content of each files
             * file content will be inserted inside this array one by one in the loop below
             * @type {[{Fichiers: string, Contenu: string}]} filesContent
             */
            let filesContent = []
            
            for (const [filename, data] of Object.entries(files)) {
                if (!this.#filesInTheZip.includes(filename)) {
                    console.warn(`Le fichier ${filename} n'est pas reconnu et ne sera pas extrait.`);
                    continue
                }

                await new Promise((resolve, reject) => {
                    new PdfReader().parseBuffer(data, (err, item) => {
                        if (err) {
                            reject(err)
                        } else if (item && item.text) {
                            const dateMatch = item.text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/)
                            filesContent.push({Fichiers: filename, Contenu: item.text, "Date de validité": dateMatch ? dateMatch[0] : 'Non spécifiée'});
                            const parsedMatchedDate = dateMatch ? parseDDMMYYYY(dateMatch[0]) : null
                            if (dateMatch && parsedMatchedDate < new Date()) {
                                console.warn(`⚠️  Le fichier "${filename}" contient une date de validité expirée : ${dateMatch[0]}.`);
                            }

                            resolve(true)
                        };
                    });
                })
            }

            console.table(filesContent)
        } catch (e) {
            console.error('❌ Une erreur est survenue lors de l\'extraction du ZIP:', e.message);
        }
    }
}

module.exports = App