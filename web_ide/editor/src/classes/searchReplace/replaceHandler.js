import LinesLoader from "../scrollingMechanisms/LinesLoader.js"

export default class ReplaceHandler {
    /**
     * 
     * @param {LinesLoader} linesLoader 
     * @param {String} textToWorkWith 
     */
    constructor(linesLoader, textToWorkWith) {
        this.linesLoader = linesLoader
        this.textToWorkWith = textToWorkWith
        this.replaceField = document.getElementById('replace-field')
        this.selectedText = ""
        this.textToReplaceWith = ""
        this.textToReplace = ""
        this.replaceField.addEventListener('input', () => {
            this.textToReplaceWith = String(this.replaceField.value)
        })
        this.replaceField.addEventListener('keydown', (event) => {
            const isPasting = event.key == "f" || event.key == "F"
            if (event.ctrlKey && isPasting) {
                this.replaceField.textContent = this.selectedText
                this.textToReplaceWith = String(this.selectedText)
            }
        })
    }

    /**
     * 
     * @param {String} selectedText 
     */
    setSelectedText(selectedText) {
        this.selectedText = selectedText
    }

    /**
     * @param {String} textToReplace
     */
    setTextToReplace(textToReplace) {
        this.textToReplace = textToReplace
    }

    replaceOne() {
    }

    replaceAll() {
        const newText = this.textToWorkWith.toLowerCase().replaceAll(this.textToReplace, this.textToReplaceWith)
    }
}