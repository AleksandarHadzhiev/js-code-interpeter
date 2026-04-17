import FileRunner from "./fileRunner.js"
import ContentPicker from "./contentPicker.js"

export default class AppRunner {

    constructor() {
        this.fileRunners = new Map()
        this.contentPicker = new ContentPicker()
    }

    /**
     * @param {String} fileName
     */
    runFile(fileName) {
        let fileRunner = null
        if (this.fileRunners.get(fileName)) {
            fileRunner = this.fileRunners.get(fileName)
        }
        else {
            const text = this.contentPicker.pickTextFromFileWithName(fileName)
            fileRunner = new FileRunner(text)
            this.fileRunners.set(fileName, fileRunner)
        }
        fileRunner.loadLines()
    }

}