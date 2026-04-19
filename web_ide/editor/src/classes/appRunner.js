import FileRunner from "./fileRunner.js"
import ContentPicker from "./contentPicker.js"
import SizeChangesHandler from "./sizesUpdateMechanisms/sizeChangesHandler.js"

export default class AppRunner {

    /**
     * @param {SizeChangesHandler} sizeChangesHandler 
     */
    constructor(sizeChangesHandler) {
        this.fileRunners = new Map()
        this.sizeChangesHandler = sizeChangesHandler
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