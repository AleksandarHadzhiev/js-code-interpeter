import SearchReplaceHandler from "./searchReplace/searchReplaceHandler.js"
import { findCaretCurrentPositionInText } from "./calculators/caretLeftOffsetCalculator.js"

export default class WriterHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     * @param {HTMLElement} contentElement 
     * @param {SearchReplaceHandler} searchReplaceHandler 
     */
    constructor(textToWorkWith, contentElement, searchReplaceHandler) {
        this.textToWorkWith = textToWorkWith
        this.contentElement = contentElement
        this.searchReplaceHandler = searchReplaceHandler
        this.caret = document.getElementById('caret')
    }

    /**
     * 
     * @param {String} textToInsert 
     */
    insertText(textToInsert) {
        const indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
        const textBefore = this.textToWorkWith.substring(0, indexInText - 1)
        const textAfter = this.textToWorkWith.substring(indexInText - 1, this.textToWorkWith.length)
        this.textToWorkWith = `${textBefore}${textToInsert}${textAfter}`
        this.searchReplaceHandler.updateText(this.textToWorkWith)
    }
}