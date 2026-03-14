import ScrollOnCaretMovement from "./scrollingMechanisms/scrollOnCaretMovement.js"
import calculateWidthForText from "./calculators/widthOfTextCalculator.js"
import turnWidthToIndexForText from "./calculators/offsetToTextCalculator.js"

export default class CaretMover {

    /**
     * 
     * @param {ScrollOnCaretMovement} scroller 
     * @param {HTMLElement} contentElement 
     * @param {HTMLElement} lineNumeration
     */
    constructor(scroller, contentElement, lineNumeration) {
        this.leftOffset = 0
        this.scroller = scroller
        this.contentElement = contentElement
        this.lineNumeration = lineNumeration
        this.lineNumerationWidth = lineNumeration.offsetWidth
    }

    resetLeftOffsetForCaretMover() {
        this.leftOffset = 0
    }

    /**
     * @param {String} keybordKey
     * @param {HTMLElement} caret
     */
    moveCaretBasedOnKeybordKey(keybordKey, caret) {
        if (keybordKey == "ArrowLeft") {
            this._moveLeft(caret)
        }
        else if (keybordKey == "ArrowRight") {
            this._moveRight(caret)
        }
        else if (keybordKey == "ArrowUp") {
            this._moveUp(caret)
        }
        else if (keybordKey == "ArrowDown") {
            this._moveDown(caret)
        }
    }

    /**
     * @param {HTMLElement} caret
     */
    _moveLeft(caret) {
        const leftOffset = caret.offsetLeft
        const topOffset = caret.offsetTop
        const lineId = Math.round(topOffset / 28.8)

        if (leftOffset - this.lineNumerationWidth > 0) {
            const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
            const text = caretIndex.fullText.substring(0, caretIndex.index - 1)
            const newLeftOffset = calculateWidthForText(this.contentElement, text) + this.lineNumerationWidth
            this.leftOffset = newLeftOffset
            caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
        }
        else if (leftOffset - this.lineNumerationWidth == 0 && lineId > 0) {
            console.log("HERE")
            const newLineId = lineId - 1
            const previousLine = document.getElementById(String(newLineId))
            const newLeftOffset = calculateWidthForText(this.contentElement, previousLine.textContent) + this.lineNumerationWidth
            this.leftOffset = newLeftOffset
            caret.style = `top: ${previousLine.offsetTop}px; left: ${newLeftOffset}px;`
        }
        const firstVisibleLine = this.scroller.linesLoader.firstVisibleLine
        console.log(lineId, firstVisibleLine)
        if (lineId - firstVisibleLine <= 5) {
            const difference = lineId - firstVisibleLine
            const lines = 5 - difference
            this.scroller.updateOffset(lines * -28.8)
        }
    }

    /**
     * 
     * @param {Number} topOffset 
     * @param {Number} leftOffset 
     */
    _getCurrentIndexForTopOffset(topOffset, leftOffset) {
        const lineId = Math.round(topOffset / 28.8)
        const lineElement = document.getElementById(String(lineId))
        const fullText = lineElement.textContent
        const leftOffsetInsideLineElement = leftOffset - this.lineNumerationWidth
        const width = calculateWidthForText(this.contentElement, fullText)
        const currentIndexInText = turnWidthToIndexForText(leftOffsetInsideLineElement, width, fullText.length)
        return {
            'index': currentIndexInText,
            'fullText': fullText
        }
    }

    /**
     * @param {HTMLElement} caret
     */
    _moveRight(caret) {
        const leftOffset = caret.offsetLeft
        const topOffset = caret.offsetTop
        const lineId = Math.round(topOffset / 28.8)
        const oldLineElement = document.getElementById(String(lineId))
        const lineElementWidth = calculateWidthForText(this.contentElement, oldLineElement.textContent)
        if (leftOffset > 0 && leftOffset - this.lineNumerationWidth < lineElementWidth) {
            const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
            const newIndex = caretIndex.index + 1
            const text = caretIndex.fullText.substring(0, newIndex)
            const newLeftOffset = calculateWidthForText(this.contentElement, text) + this.lineNumerationWidth
            this.leftOffset = newLeftOffset
            caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
        }
        else if (leftOffset - this.lineNumerationWidth == lineElementWidth && lineId < 2000) {
            const newLineId = lineId + 1
            const nextLineElement = document.getElementById(String(newLineId))
            const newLeftOffset = this.lineNumerationWidth
            this.leftOffset = newLeftOffset
            caret.style = `top: ${nextLineElement.offsetTop}px; left: ${newLeftOffset}px;`
        }
        const lastVisibleLine = this.scroller.linesLoader.lastVisibleLine - 1
        console.log(lastVisibleLine, lineId)
        if (lastVisibleLine - lineId <= 5 && lastVisibleLine - lineId > 0) {
            const difference = lastVisibleLine - lineId
            const lines = 5 - difference
            this.scroller.updateOffset(lines * 28.8)
        }
    }

    /**
     * @param {HTMLElement} caret
     */
    _moveUp(caret) {
        const topOffset = caret.offsetTop
        const leftOffset = caret.offsetLeft
        if (leftOffset != this.leftOffset && this.leftOffset == 0)
            this.leftOffset = leftOffset
        console.log(topOffset, leftOffset)
        if (topOffset > 0) {
            const lineId = Math.round(topOffset / 28.8)
            const oldLineElement = document.getElementById(String(lineId))
            console.log(oldLineElement.textContent)
            const newLineId = lineId - 1
            const lineElement = document.getElementById(String(newLineId))
            let newLeftOffset = this._calculateNewLeftOffset(lineElement)
            const newOffset = lineElement.offsetTop
            caret.style = `top: ${newOffset}px; left: ${newLeftOffset}px;`
            const firstVisibleLine = this.scroller.linesLoader.firstVisibleLine
            console.log(newLineId, firstVisibleLine)
            if (newLineId - firstVisibleLine <= 5) {
                this.scroller.updateOffset(-28.8)
            }
        }
    }

    /**
     * 
     * @param {Number} leftOffset 
     * @param {HTMLElement} lineElement 
     */
    _calculateNewLeftOffset(lineElement) {
        const widthOfText = calculateWidthForText(this.contentElement, lineElement.textContent)
        console.log(widthOfText)
        let newLeftOffset = this.leftOffset
        if (widthOfText < this.leftOffset - this.lineNumerationWidth) {
            newLeftOffset = widthOfText + this.lineNumerationWidth
        }
        else {
            newLeftOffset = this.leftOffset
        }
        return newLeftOffset
    }

    /**
     * 
     * @param {HTMLElement} caret 
     */
    _moveDown(caret) {
        const topOffset = caret.offsetTop
        const leftOffset = caret.offsetLeft
        console.log(this.leftOffset)
        if (leftOffset != this.leftOffset && this.leftOffset == 0)
            this.leftOffset = leftOffset
        if (topOffset < 2000 * 28.8) {
            const lineId = Math.round(topOffset / 28.8)
            const newLineId = lineId + 1
            const lineElement = document.getElementById(String(newLineId))
            let newLeftOffset = this._calculateNewLeftOffset(lineElement)
            const newOffset = lineElement.offsetTop
            caret.style = `top: ${newOffset}px; left: ${newLeftOffset}px;`
            const lastVisibleLine = this.scroller.linesLoader.lastVisibleLine - 1
            console.log(lastVisibleLine, newLineId)
            if (lastVisibleLine - newLineId <= 5 && lastVisibleLine - newLineId > 0) {
                this.scroller.updateOffset(28.8)
            }
        }
    }
}