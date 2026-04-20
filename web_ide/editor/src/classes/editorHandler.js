export default class EditorHandler {
    constructor() {
        this.editorElement = document.getElementById('container')
        this.leftOffsetForContent = this.editorElement.offsetLeft
        this.widthForContent = this.editorElement.offsetWidth
        this.heightForContent = this.editorElement.offsetHeight
        this.topOffsetForContent = this.editorElement.offsetTop
        this.openedFiles = new Map()
    }

    addFile(fileName, file) {
        this.openedFiles.set(fileName, file)
    }

    /**
     * 
     * @param {Number} newLeftOffsetForContent 
     * @param {Number} width 
     */
    updateLeftOffsetWithNewOffset(newLeftOffsetForContent, width) {
        this.leftOffsetForContent = newLeftOffsetForContent
        this.widthForContent = width
        console.log(this)
    }
}