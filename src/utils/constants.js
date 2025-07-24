module.exports = {
    TITLE: "acdmp",
    VERSION: "1.0.0",
    DESCRIPTION: `Un outil en ligne de commade permettant de :
        - Accepter un dossier ZIP en entrée
        - Détecter la présence ou absence de fichiers type (Kbis, DC1, etc.)
        - Extraire les dates de validité depuis les PDF
        - Remonter une alerte si un document est expiré ou manquant
        - Afficher un résumé clair
    `,
    COMMAND_NAME: "run",
    COMMAND_DESCRIPTION: "Lit un fichier ZIP et vérifie la présence des fichiers requis"
}