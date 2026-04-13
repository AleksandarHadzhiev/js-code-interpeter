import SearchReplaceHandler from "./searchReplace/searchReplaceHandler.js"
import { findCaretCurrentPositionInText } from "./calculators/caretLeftOffsetCalculator.js"
import CaretBuilder from "./selectionMechanisms/caretBuilder.js"
import turnWidthToIndexForText from "./calculators/offsetToTextCalculator.js"
import calculateWidthForText from "./calculators/widthOfTextCalculator.js"

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
        let indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
        let newIndexForCaret = indexInText
        const textBefore = this.textToWorkWith.substring(0, indexInText - 1)
        const textAfter = this.textToWorkWith.substring(indexInText, this.textToWorkWith.length)
        newIndexForCaret = indexInText - 1
        this.textToWorkWith = `${textBefore}${textAfter}`
        this.searchReplaceHandler.updateText(this.textToWorkWith)
        this._moveCaretOneIndexFurther(newIndexForCaret)
    }

    /**
     * 
     * @param {String} textToInsert 
     */
    insertText(textToInsert) {
        const indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
        const textBefore = this.textToWorkWith.substring(0, indexInText)
        const textAfter = this.textToWorkWith.substring(indexInText, this.textToWorkWith.length)
        const newIndexForCaret = indexInText + textToInsert.length
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
        this.caretBuilder.rebuildCaretForInsertingText(lines, this.contentElement)
    }
}