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
        const text = this.contentPicker.pickTextFromFileWithName(fileName)
        const fileRunner = new FileRunner(text)
        this.fileRunners.set(fileName, fileRunner)
        fileRunner.loadLines()
    }

}