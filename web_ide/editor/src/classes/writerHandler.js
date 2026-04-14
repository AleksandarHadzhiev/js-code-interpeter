import SearchReplaceHandler from "./searchReplace/searchReplaceHandler.js"
import { findCaretCurrentPositionInText } from "./calculators/caretLeftOffsetCalculator.js"
import CaretBuilder from "./selectionMechanisms/caretBuilder.js"
import CodeChangesHistoryHandler from "./codeChangesHistoryHandler.js"

export default class WriterHandler {
    /**
     * 
     * @param {String} textToWorkWith 
     * @param {HTMLElement} contentElement 
     * @param {SearchReplaceHandler} searchReplaceHandler 
     * @param {CaretBuilder} caretBuilder 
     * @param {CodeChangesHistoryHandler} codeChangesHistoryHandler 
     */
    constructor(textToWorkWith, contentElement, searchReplaceHandler, caretBuilder, codeChangesHistoryHandler) {
        this.textToWorkWith = textToWorkWith
        this.contentElement = contentElement
        this.searchReplaceHandler = searchReplaceHandler
        this.caret = document.getElementById('caret')
        this.caretBuilder = caretBuilder
        this.codeChangesHistoryHandler = codeChangesHistoryHandler
    }

    /**
     * @param {{text: String, starting: Number, ending: Number}} selectedText
     */
    removeText(selectedText) {
        if (selectedText != null) {
            this._replaceTextBetweenIndexes(selectedText, "")
        }
        else {
            let indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
            let newIndexForCaret = indexInText
            const textBefore = this.textToWorkWith.substring(0, indexInText - 1)
            const textAfter = this.textToWorkWith.substring(indexInText, this.textToWorkWith.length)
            newIndexForCaret = indexInText - 1
            this.textToWorkWith = `${textBefore}${textAfter}`
            this.searchReplaceHandler.updateText(this.textToWorkWith)
            this._moveCaretOneIndexFurther(newIndexForCaret)
        }
        this.codeChangesHistoryHandler.insertChange(this.textToWorkWith)
    }

    /**
     * 
     * @param {String} textToInsert 
     * @param {{text: String, starting: Number, ending: Number}} selectedText
     */
    insertText(textToInsert, selectedText) {
        if (selectedText != null) {
            this._replaceTextBetweenIndexes(selectedText, textToInsert)
        }
        else {
            const indexInText = findCaretCurrentPositionInText(this.caret, this.textToWorkWith, this.contentElement)
            const textBefore = this.textToWorkWith.substring(0, indexInText)
            const textAfter = this.textToWorkWith.substring(indexInText, this.textToWorkWith.length)
            const newIndexForCaret = indexInText + textToInsert.length
            this.textToWorkWith = `${textBefore}${textToInsert}${textAfter}`
            this.searchReplaceHandler.updateText(this.textToWorkWith)
            this._moveCaretOneIndexFurther(newIndexForCaret)
        }
        this.codeChangesHistoryHandler.insertChange(this.textToWorkWith)
    }

    /**
     * 
     * @param {{text: String, starting: Number, ending: Number}} selectedText
     */
    _replaceTextBetweenIndexes(selectedText, textToReplaceWith) {
        const textBefore = this.textToWorkWith.substring(0, selectedText.starting)
        const textAfter = this.textToWorkWith.substring(selectedText.ending, this.textToWorkWith.length)
        this.textToWorkWith = `${textBefore}${textToReplaceWith}${textAfter}`
        const newIndexForCaret = selectedText.starting + textToReplaceWith.length
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
        const marker = document.getElementById('marker')
        if (marker) marker.remove()
    }
}