import FileRunner from "./fileRunner.js"
import ContentPicker from "./contentPicker.js"
import SizeChangesHandler from "./sizesUpdateMechanisms/sizeChangesHandler.js"
import EditorHandler from "./editorHandler.js"

export default class AppRunner {

    /**
     * @param {SizeChangesHandler} sizeChangesHandler 
     * @param {EditorHandler} editorHandler 
     */
    constructor(sizeChangesHandler, editorHandler) {
        this.fileRunners = new Map()
        this.sizeChangesHandler = sizeChangesHandler
        this.contentPicker = new ContentPicker()
        this.editorHandler = editorHandler
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
            this.sizeChangesHandler.addListener(fileRunner.mousePositionDefiner)
        }
        fileRunner.loadLines()
        this.editorHandler.addFile(fileName, fileRunner)
    }
}