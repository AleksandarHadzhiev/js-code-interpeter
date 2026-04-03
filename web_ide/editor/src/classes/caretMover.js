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
        this.regex = /\s +| | ;|,|\.|"|\(|\)/g;
    }

    updateLineNumerationWidth() {
        this.lineNumerationWidth = this.lineNumeration.offsetWidth

    }

    resetLeftOffsetForCaretMover() {
        this.leftOffset = 0
    }

    /**
     * @param {KeyboardEvent} mouseEvent
     * @param {HTMLElement} caret
     */
    moveCaretBasedOnKeybordKey(mouseEvent, caret) {
        const keybordKey = mouseEvent.key
        const isUsingCtrl = mouseEvent.ctrlKey
        if (keybordKey == "ArrowLeft") {
            this._moveLeft(caret, isUsingCtrl)
        }
        else if (keybordKey == "ArrowRight") {
            this._moveRight(caret, isUsingCtrl)
        }
        else if (keybordKey == "ArrowUp") {
            this._moveUp(caret, isUsingCtrl)
        }
        else if (keybordKey == "ArrowDown") {
            this._moveDown(caret, isUsingCtrl)
        }
    }

    /**
     * @param {HTMLElement} caret
     * @param {Boolean} isUsingCtrl
     */
    _moveLeft(caret, isUsingCtrl) {
        const leftOffset = caret.offsetLeft
        const topOffset = caret.offsetTop
        const lineId = Math.round(topOffset / 28.8)
        this._scrollUp(lineId, lineId)
        if (isUsingCtrl) {
            this._moveLeftWithCtrl(leftOffset, lineId, topOffset)
        }
        else {
            this._moveLeftWithoutCtrl(leftOffset, topOffset, lineId)
        }
    }

    _moveLeftWithCtrl(leftOffset, lineId, topOffset) {
        if (leftOffset - this.lineNumerationWidth == 0 && lineId > 0) {
            this._goUpALine(lineId)
        }
        else {
            this._moveCaretToTheLeft(topOffset, leftOffset)
        }
    }

    _goUpALine(lineId) {
        const newLineId = lineId - 1
        const previousLine = document.getElementById(String(newLineId))
        const newLeftOffset = calculateWidthForText(this.contentElement, previousLine.textContent) + this.lineNumerationWidth
        this.leftOffset = newLeftOffset
        caret.style = `top: ${previousLine.offsetTop}px; left: ${newLeftOffset}px;`
    }

    _moveCaretToTheLeft(topOffset, leftOffset) {
        const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
        let lastIndexOfEmptyString = 0
        const spots = caretIndex.fullText.matchAll(this.regex)
        spots.forEach((spot) => {
            let indexOfSpot = spot.index
            if (indexOfSpot < caretIndex.index) {
                lastIndexOfEmptyString = indexOfSpot + String(spot[0]).length == caretIndex.index ? indexOfSpot : indexOfSpot + String(spot[0]).length
            }
        })
        const textTillEmpty = caretIndex.fullText.substring(0, lastIndexOfEmptyString)
        const newLeftOffset = calculateWidthForText(this.contentElement, textTillEmpty) + this.lineNumerationWidth
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
    }

    _moveLeftWithoutCtrl(leftOffset, topOffset, lineId) {
        if (leftOffset - this.lineNumerationWidth > 0) {
            this._moveLeftOnSameLineWithoutCtrl(topOffset, leftOffset)
        }
        else if (leftOffset - this.lineNumerationWidth == 0 && lineId > 0) {
            this._goUpALine(lineId)
        }
    }

    _moveLeftOnSameLineWithoutCtrl(topOffset, leftOffset) {
        const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
        let newIndex = caretIndex.index - 1
        let text = caretIndex.fullText.substring(0, newIndex)
        let newLeftOffset = calculateWidthForText(this.contentElement, text) + this.lineNumerationWidth
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
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
     * @param {Boolean} isUsingCtrl
     */
    _moveRight(caret, isUsingCtrl) {
        const leftOffset = caret.offsetLeft
        const topOffset = caret.offsetTop
        const lineId = Math.round(topOffset / 28.8)
        this._scrollDown(lineId, lineId)
        const oldLineElement = document.getElementById(String(lineId))
        const lineElementWidth = calculateWidthForText(this.contentElement, oldLineElement.textContent)
        if (isUsingCtrl) {
            this._moveCaretRightWhileUsingCtrl(leftOffset, topOffset, lineId, lineElementWidth)
        }
        else {
            this._moveCaretLineWithoutCtrl(leftOffset, topOffset, lineElementWidth, lineId)
        }
    }

    _moveCaretRightWhileUsingCtrl(leftOffset, topOffset, lineId, lineElementWidth) {
        if (leftOffset - this.lineNumerationWidth == lineElementWidth && lineId < 2000) {
            this._moveRightWhenGoingDownALine(lineId)
        }
        else {
            this._moveRightOnSameLine(topOffset, leftOffset)
        }
    }

    _moveRightWhenGoingDownALine(lineId) {
        const newLineId = lineId + 1
        const nextLineElement = document.getElementById(String(newLineId))
        const newLeftOffset = this.lineNumerationWidth
        this.leftOffset = newLeftOffset
        caret.style = `top: ${nextLineElement.offsetTop}px; left: ${newLeftOffset}px;`
        this.scroller.updateLeftOffset(75)
    }

    _moveRightOnSameLine(topOffset, leftOffset) {
        const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
        const spots = caretIndex.fullText.matchAll(this.regex)
        let isFirst = false
        let firstEmptySpace = caretIndex.fullText.length
        spots.forEach((spot) => {
            let indexOfSpot = spot.index
            if (indexOfSpot >= caretIndex.index && isFirst == false) {
                isFirst = true
                indexOfSpot = String(spot[0]).trim() == "" && String(spot[0]) != " " ? indexOfSpot + String(spot[0]).length : indexOfSpot
                firstEmptySpace = indexOfSpot == caretIndex.index ? indexOfSpot : indexOfSpot - 1
                firstEmptySpace += 1
            }
        })
        const textTillEmpty = caretIndex.fullText.substring(0, firstEmptySpace)
        const newLeftOffset = calculateWidthForText(this.contentElement, textTillEmpty) + this.lineNumerationWidth
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
    }

    _moveCaretLineWithoutCtrl(leftOffset, topOffset, lineElementWidth, lineId) {
        if (leftOffset > 0 && leftOffset - this.lineNumerationWidth < lineElementWidth) {
            this._moveCaretAtTheSameLineForRight(topOffset, leftOffset)
        }
        else if (leftOffset - this.lineNumerationWidth == lineElementWidth && lineId < 2000) {
            this._moveRightWhenGoingDownALine(lineId)
        }
    }

    _moveCaretAtTheSameLineForRight(topOffset, leftOffset) {
        const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
        const newIndex = caretIndex.index + 1
        const text = caretIndex.fullText.substring(0, newIndex)
        const newLeftOffset = calculateWidthForText(this.contentElement, text) + this.lineNumerationWidth
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
    }

    /**
     * @param {HTMLElement} caret
     * @param {Boolean} isUsingCtrl
     */
    _moveUp(caret, isUsingCtrl) {
        const topOffset = caret.offsetTop
        const leftOffset = caret.offsetLeft
        if (leftOffset != this.leftOffset && this.leftOffset == 0)
            this.leftOffset = leftOffset
        if (isUsingCtrl) {
            this.scroller.updateTopOffset(-28.8)
        }
        else {
            this._moveLineUpALine(topOffset)
        }
    }


    _moveLineUpALine(topOffset) {
        if (topOffset > 0) {
            const lineId = Math.round(topOffset / 28.8)
            const newLineId = lineId - 1
            const lineElement = document.getElementById(String(newLineId))
            let newLeftOffset = this._calculateNewLeftOffset(lineElement)
            const newOffset = lineElement.offsetTop
            caret.style = `top: ${newOffset}px; left: ${newLeftOffset}px;`
            this._scrollUp(newLineId, lineId)
        }
    }

    _scrollUp(newLineId, lineId) {
        const firstVisibleLine = this.scroller.linesLoader.firstVisibleLine
        if (newLineId - firstVisibleLine <= 5) {
            const difference = lineId - firstVisibleLine
            const lines = 5 - difference
            this.scroller.updateTopOffset(lines * -28.8)
        }
    }

    /**
     * 
     * @param {Number} leftOffset 
     * @param {HTMLElement} lineElement 
     */
    _calculateNewLeftOffset(lineElement) {
        const widthOfText = calculateWidthForText(this.contentElement, lineElement.textContent)
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
     * @param {Boolean} isUsingCtrl 
     */
    _moveDown(caret, isUsingCtrl) {
        const topOffset = caret.offsetTop
        const leftOffset = caret.offsetLeft
        if (leftOffset != this.leftOffset && this.leftOffset == 0)
            this.leftOffset = leftOffset
        if (isUsingCtrl) {
            this.scroller.updateTopOffset(28.8)
        }
        else {
            this._moveCaretDownALine(topOffset)
        }
    }

    _moveCaretDownALine(topOffset) {
        if (topOffset < 2000 * 28.8) {
            const lineId = Math.round(topOffset / 28.8)
            const newLineId = lineId + 1
            const lineElement = document.getElementById(String(newLineId))
            let newLeftOffset = this._calculateNewLeftOffset(lineElement)
            const newOffset = lineElement.offsetTop
            caret.style = `top: ${newOffset}px; left: ${newLeftOffset}px;`
            this._scrollDown(newLineId, lineId)
        }
    }

    _scrollDown(newLineId, lineId) {
        const lastVisibleLine = this.scroller.linesLoader.lastVisibleLine - 1
        if (lastVisibleLine - newLineId <= 5 && lastVisibleLine - newLineId > 0) {
            const difference = lastVisibleLine - lineId
            const lines = 5 - difference
            this.scroller.updateTopOffset(lines * 28.8)
        }
    }
}