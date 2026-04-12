import SearchReplaceHandler from "./searchReplace/searchReplaceHandler.js"
import { findCaretCurrentPositionInText } from "./calculators/caretLeftOffsetCalculator.js"
import CaretBuilder from "./selectionMechanisms/caretBuilder.js"
import turnWidthToIndexForText from "./calculators/offsetToTextCalculator.js"

export default class WriterHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     * @param {HTMLElement} contentElement 
     * @param {SearchReplaceHandler} searchReplaceHandler 
     * @param {CaretBuilder} caretBuilder 
     */
    constructor(textToWorkWith, contentElement, searchReplaceHandler, caretBuilder) {
        this.textToWorkWith = textToWorkWith
        this.contentElement = contentElement
        this.searchReplaceHandler = searchReplaceHandler
        this.caret = document.getElementById('caret')
        this.caretBuilder = caretBuilder
    }

    removeText() {
        const indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
        const isStartOfLine = this._checkIfAtStartOfLine()
        if (isStartOfLine == false) {
            const textBefore = this.textToWorkWith.substring(0, indexInText - 2)
            const textAfter = this.textToWorkWith.substring(indexInText - 1, this.textToWorkWith.length)
            const newIndexForCaret = indexInText - 2
            this.textToWorkWith = `${textBefore}${textAfter}`
            this.searchReplaceHandler.updateText(this.textToWorkWith)
            this._moveCaretOneIndexFurther(newIndexForCaret)
        }
        else {

        }

    }

    _checkIfAtStartOfLine() {
        if (this.caret.offsetLeft == 0) {
            return true
        }
        return false
    }

    /**
     * 
     * @param {String} textToInsert 
     */
    insertText(textToInsert) {
        const indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
        const textBefore = this.textToWorkWith.substring(0, indexInText - 1)
        const textAfter = this.textToWorkWith.substring(indexInText - 1, this.textToWorkWith.length)
        const newIndexForCaret = indexInText + textToInsert.length - 1
        this.textToWorkWith = `${textBefore}${textToInsert}${textAfter}`
        this.searchReplaceHandler.updateText(this.textToWorkWith)
        this._moveCaretOneIndexFurther(newIndexForCaret)
    }

    /**
     * 
     * @param {Number} newIndexForCaret 
     */
    _moveCaretOneIndexFurther(newIndexForCaret) {
        const text = this.textToWorkWith.substring(0, newIndexForCaret)
        const lines = text.split('\n')
        this.caretBuilder.rebuildCaretForInsertingText(text, lines, this.contentElement)
    }
}