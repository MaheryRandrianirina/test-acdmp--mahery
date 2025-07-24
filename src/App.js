const { Command } = require('commander')
const program = new Command()
const { TITLE, VERSION, DESCRIPTION, COMMAND_NAME, COMMAND_DESCRIPTION } = require('./utils/constants')
const fs = require('fs')
const { unzipSync } = require('fflate')
const path = require('path')
const { PdfReader } = require('pdfreader')

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
            .action((zipPath) => {
                if (!fs.existsSync(zipPath)) {
                    console.error(`Le fichier ${zipPath} n'existe pas.`)
                    return
                }
                
                try {
                    const fileBuffer = fs.readFileSync(zipPath)
                    const files = unzipSync(fileBuffer)
                    const outDir = path.join(process.cwd(), path.parse(zipPath).name)
    
                    // verify if the zip contains the expected files
                    const missingFiles = this.#filesInTheZip.filter(file => !Object.keys(files).includes(file));
                    if (missingFiles.length > 0) {
                        console.warn(`❌ Attention : Le fichier ZIP ne contient pas les fichiers suivants : ${missingFiles.join(', ')}.`);
                        return
                    }

                    
                    for (const [filename, data] of Object.entries(files)) {
                        if( !this.#filesInTheZip.includes(filename)) {
                            console.warn(`Le fichier ${filename} n'est pas reconnu et ne sera pas extrait.`);
                            continue
                        }

                        new PdfReader().parseBuffer(data, (err, item) => {
                            if (err) {
                                console.error("Error:", err)
                            }else if (item && item.text) {
                                const dateMatch = item.text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/)
                                if (dateMatch && dateMatch < new Date().toLocaleDateString('fr-FR')) {
                                    console.warn(`Le fichier ${filename} contient une date de validité expirée : ${dateMatch[0]}.`);
                                }
                            };
                        });
                    }
                }catch(e) {
                    console.error('❌ Une erreur est survenue lors de l\'extraction du ZIP:', e.message);
                }

            })

        program.parse(process.argv)

    }
}

module.exports = App