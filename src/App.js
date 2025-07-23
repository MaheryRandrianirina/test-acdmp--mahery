const { Command } = require('commander')
const program = new Command()
const { TITLE, VERSION, DESCRIPTION, COMMAND_NAME, COMMAND_DESCRIPTION } = require('./utils/constants')
const fs = require('fs')
const { unzipSync } = require('fflate')
const path = require('path')

class App {

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
                    
                    if (!fs.existsSync(outDir)) {
                        fs.mkdirSync(outDir);
                    }
    
                    for (const [filename, data] of Object.entries(files)) {
                        const filePath = path.join(outDir, filename);
                        const dirPath = path.dirname(filePath);
                      
                        fs.mkdirSync(dirPath, { recursive: true });
                        fs.writeFileSync(filePath, data.toString());
                    }
                    
                }catch(e) {
                    console.error('❌ Une erreur est survenue lors de l\'extraction du ZIP:', e.message);
                }

            })

        program.parse(process.argv)

    }
}

module.exports = App