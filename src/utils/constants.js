module.exports = {
    TITLE: "acdmp",
    VERSION: "1.0.0",
    DESCRIPTION: `Un outil en ligne de commade permettant de :
        - Accepte un dossier ZIP en entrée
        - Détecte la présence ou absence de fichiers type (Kbis, DC1, etc.)
        - Extrait les dates de validité depuis les PDF
        - Remonte une alerte si un document est expiré ou manquant
        - Affiche ou retourne un résumé clair (JSON ou interface simple)
    `,
    COMMAND_NAME: "run",
    COMMAND_DESCRIPTION: "Lit un fichier ZIP et vérifie la présence des fichiers requis"
}