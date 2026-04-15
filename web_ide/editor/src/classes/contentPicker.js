import { textToWorkWith, shortText } from "../../textToWorkWith.js"

export default class ContentPicker {
    constructor() {
        this.contents = new Map()
        this.contents.set('index.js', shortText)
        this.contents.set('app.js', textToWorkWith)
    }

    /**
     * @param {String} fileName
     * @returns {String} the text of the file
     */
    pickTextFromFileWithName(fileName) {
        return this.contents.get(fileName)
    }
}