import ScrollOnCaretMovement from "./scrollingMechanisms/scrollOnCaretMovement.js"
import calculateWidthForText from "./calculators/widthOfTextCalculator.js"
import turnWidthToIndexForText from "./calculators/offsetToTextCalculator.js"

export default class CaretMover {

    /**
     * 
     * @param {ScrollOnCaretMovement} scroller 
     * @param {HTMLElement} lineContentElement 
     */
    constructor(scroller, lineContentElement) {
        this.leftOffset = 0
        this.content = document.getElementById('content')
        this.scroller = scroller
        this.bufferZone = 75
        this.lineContentElement = lineContentElement
        this.widthLongestContent = lineContentElement.offsetWidth
        this.startingOffset = (this.lineContentElement.offsetLeft * -1) + this.bufferZone
        this.screenWidth = this.startingOffset + this.lineContentElement.parentElement.offsetWidth - this.bufferZone - 25
        this.regex = /\s +| | ;|,|\.|"|\(|\)/g;
    }

    updateScreenWidth() {
        this.startingOffset = (this.lineContentElement.offsetLeft * -1) + this.bufferZone
        this.screenWidth = this.startingOffset + this.lineContentElement.parentElement.offsetWidth - this.bufferZone - 25
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
        if (leftOffset == 0 && lineId > 0) {
            this._goUpALine(lineId)
        }
        else {
            this._moveCaretToTheLeft(topOffset, leftOffset)
        }
    }

    _goUpALine(lineId) {
        const newLineId = lineId - 1
        const previousLine = document.getElementById(String(newLineId))
        const newLeftOffset = calculateWidthForText(this.lineContentElement, previousLine.textContent)
        this.leftOffset = newLeftOffset
        caret.style = `top: ${previousLine.offsetTop}px; left: ${newLeftOffset}px;`
        this._scrollHorizontally(newLeftOffset)
    }

    _scrollHorizontally(leftOffset) {
        const parentLeftOffset = (this.lineContentElement.offsetLeft * -1) + 75
        const widthOfScreen = parentLeftOffset + this.lineContentElement.parentElement.offsetWidth - this.bufferZone - 25
        const parentWidth = this.widthLongestContent
        if (leftOffset <= parentLeftOffset + 50) {
            let distance = leftOffset - 50
            const percentage = (distance / parentWidth) * 100
            this.scroller.updateLeftOffsetWithPercentage(percentage)
        }
        else if (leftOffset + 50 >= widthOfScreen) {
            let distance = leftOffset - 50
            const percentage = ((distance) / parentWidth) * 100
            this.scroller.updateLeftOffsetWithPercentage(percentage)
        }
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
        const newLeftOffset = calculateWidthForText(this.lineContentElement, textTillEmpty)
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
        this._scrollHorizontally(newLeftOffset)
    }

    _moveLeftWithoutCtrl(leftOffset, topOffset, lineId) {
        if (leftOffset > 0) {
            this._moveLeftOnSameLineWithoutCtrl(topOffset, leftOffset)
        }
        else if (leftOffset <= 0 && lineId > 0) {
            this._goUpALine(lineId)
        }
    }

    _moveLeftOnSameLineWithoutCtrl(topOffset, leftOffset) {
        const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
        let newIndex = caretIndex.index - 1
        let text = caretIndex.fullText.substring(0, newIndex)
        let newLeftOffset = calculateWidthForText(this.lineContentElement, text)
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
        this._scrollHorizontally(newLeftOffset)
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
        const leftOffsetInsideLineElement = leftOffset
        const width = calculateWidthForText(this.lineContentElement, fullText)
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
        const lineElementWidth = calculateWidthForText(this.lineContentElement, oldLineElement.textContent)
        if (isUsingCtrl) {
            this._moveCaretRightWhileUsingCtrl(leftOffset, topOffset, lineId, lineElementWidth)
        }
        else {
            this._moveCaretLineWithoutCtrl(leftOffset, topOffset, lineElementWidth, lineId)
        }
    }

    _moveCaretRightWhileUsingCtrl(leftOffset, topOffset, lineId, lineElementWidth) {
        if (leftOffset == lineElementWidth && lineId < 2000) {

            this._moveRightWhenGoingDownALine(lineId)
        }
        else {
            this._moveRightOnSameLine(topOffset, leftOffset)
        }
    }

    _moveRightWhenGoingDownALine(lineId) {
        const newLineId = lineId + 1
        const nextLineElement = document.getElementById(String(newLineId))
        const newLeftOffset = 0
        this.leftOffset = newLeftOffset
        caret.style = `top: ${nextLineElement.offsetTop}px; left: ${newLeftOffset}px;`
        this._scrollHorizontally(newLeftOffset)
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
        const newLeftOffset = calculateWidthForText(this.lineContentElement, textTillEmpty)
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
        this._scrollHorizontally(newLeftOffset)
    }

    _moveCaretLineWithoutCtrl(leftOffset, topOffset, lineElementWidth, lineId) {
        if (leftOffset >= 0 && leftOffset < lineElementWidth) {
            this._moveCaretAtTheSameLineForRight(topOffset, leftOffset)
        }
        else if (leftOffset == lineElementWidth && lineId < 2000) {
            this._moveRightWhenGoingDownALine(lineId)
        }
    }

    _moveCaretAtTheSameLineForRight(topOffset, leftOffset) {
        const caretIndex = this._getCurrentIndexForTopOffset(topOffset, leftOffset)
        const newIndex = caretIndex.index + 1
        const text = caretIndex.fullText.substring(0, newIndex)
        const newLeftOffset = calculateWidthForText(this.lineContentElement, text)
        this.leftOffset = newLeftOffset
        caret.style = `top: ${topOffset}px; left: ${newLeftOffset}px;`
        this._scrollHorizontally(newLeftOffset)
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
            this._scrollHorizontally(newLeftOffset)
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
        const widthOfText = calculateWidthForText(this.lineContentElement, lineElement.textContent)
        let newLeftOffset = this.leftOffset
        if (widthOfText < this.leftOffset) {
            newLeftOffset = widthOfText
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
            this._scrollHorizontally(newLeftOffset)
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