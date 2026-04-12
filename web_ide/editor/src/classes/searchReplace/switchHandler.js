import calculateWidthForText from "../calculators/widthOfTextCalculator.js"
import { BarHorizontalHandler, BarVerticalHandler } from "../scrollingMechanisms/BarHandler.js"
import LinesLoader from "../scrollingMechanisms/LinesLoader.js"
import LoaderHandler from "../scrollingMechanisms/LoaderHandler.js"
import Coordinates from "./coordinates.js"

export default class SwitchHandler {
    /**
     * @param {String} textToWorkWith 
     * @param {LoaderHandler} loaderHandler 
     * @param {BarVerticalHandler} barVerticalHandler 
     * @param {BarHorizontalHandler} barHorizontalHandler 
     * @param {LinesLoader} linesLoader 
     */
    constructor(textToWorkWith, loaderHandler, barVerticalHandler, barHorizontalHandler, linesLoader) {
        this.loaderHandler = loaderHandler
        this.barVerticalHandler = barVerticalHandler
        this.barHorizontalHandler = barHorizontalHandler
        this.linesLoader = linesLoader
        this.content = document.getElementById('content')
        this.caretPlacer = document.getElementById('caret-placer')
        this.textToWorkWith = textToWorkWith
        this.startingPosition = 0
        this.currentPosition = 0
        this.endingPosition = 0
        this.focusedHighlight = null // Will be the element which is lightly colorosed
        this.highlights = new Map()
        this.textToSearchForAsLines = []
    }

    updateTextToWorkWith(newTextToWorkWith) {
        this.textToWorkWith = newTextToWorkWith
    }

    /**
     * 
     * @param {Array} lines 
     */
    setTextToSearchFor(lines) {
        this.textToSearchForAsLines = lines
    }

    /**
     * 
     * @param {Number} newCurrentPosition 
     * @param {Number} newEndingPosition 
     */
    updatePositions(newCurrentPosition, newEndingPosition) {
        this.currentPosition = newCurrentPosition
        this.endingPosition = newEndingPosition - 1
    }

    /**
     * 
     * @param {Map} newHighlights 
     */
    setHighlights(newHighlights) {
        this.highlights = newHighlights
        this.focusedHighlight = this._getFocusedHighlights()
        this.caretPlacer.appendChild(this.focusedHighlight)
    }


    /**
     * 
     * @returns {HTMLElement}
     */
    _getFocusedHighlights() {
        const focusedHighligtAsIndexInText = this.highlights.get(this.currentPosition)
        const lineHighlighter = this._turnIndexIntoHighlightedElement(focusedHighligtAsIndexInText)
        return lineHighlighter
    }

    /**
     * 
     * @param {Number} index 
     */
    _turnIndexIntoHighlightedElement(index) {
        const textBefore = this.textToWorkWith.substring(0, index)
        const lines = textBefore.split('\n')
        const lineId = lines.length - 1
        let highlighterElement = document.getElementById(`${lineId}-highlighter`)
        const textBeforeSearch = lines.pop()
        const leftOffset = calculateWidthForText(this.content, textBeforeSearch)
        let topOffset = lineId * 28.8
        if (highlighterElement == null) {
            const percentage = (topOffset / this.loaderHandler.height) * 100
            this.loaderHandler.scrollWithPercentage(percentage)
            this.barVerticalHandler.scrollBasedOnPercentage(percentage)
            this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
        }
        const specialHighlighter = this._buildSpeicalHighlighter()
        const lineHighlighter = this._buildLineHighlighter(lineId, topOffset)
        const widths = this._calculateWidthsLine()
        widths.forEach((width, index) => {
            let coordinates = new Coordinates(width, 0, index * 28.8)
            if (index == 0) {
                coordinates = new Coordinates(width, leftOffset, 0)
            }
            const highlight = this._buildHighlight(coordinates)
            lineHighlighter.appendChild(highlight)
        })
        specialHighlighter.appendChild(lineHighlighter)
        return specialHighlighter
    }

    _buildSpeicalHighlighter() {
        let specialHighlighter = document.getElementById('special-highlighter')
        if (specialHighlighter) specialHighlighter.remove()
        specialHighlighter = document.createElement('div')
        specialHighlighter.setAttribute('id', 'special-highlighter')
        specialHighlighter.style = `position: absolute;`
        return specialHighlighter
    }

    /**
     * 
     * @returns {Array}
     */
    _calculateWidthsLine() {
        const widths = []
        if (this.textToSearchForAsLines.length == 1) {
            const width = calculateWidthForText(this.content, this.textToSearchForAsLines[0])
            widths.push(width)
            return widths
        }
        return this._multiLine(widths)
    }

    /**
     * 
     * @param {Array} widths 
     * @returns {Array}
     */
    _multiLine(widths) {
        this.textToSearchForAsLines.forEach((content) => {
            const width = calculateWidthForText(this.content, content)
            widths.push(width)
        })
        return widths
    }

    _buildLineHighlighter(id, topOffset) {
        const lineHighlighter = document.createElement('div')
        lineHighlighter.classList.add(`line-content-marker`)
        lineHighlighter.setAttribute('id', `${id}-highlighter`)
        lineHighlighter.style = `top: ${topOffset}px;`
        return lineHighlighter
    }

    /**
     * 
     * @param {Coordinates} coordinates 
     * @returns 
     */
    _buildHighlight(coordinates) {
        const highlight = document.createElement('span')
        highlight.style =
            `
            position: absolute;
            background-color: blue;
            width: ${coordinates.width}px;
            height: 28.8px;
            top: ${coordinates.top}px;
            left: ${coordinates.left}px;
        `
        return highlight
    }

    goUp() {
        this.focusedHighlight.remove()
        this._updateCurrentPosition(this.currentPosition - 1)
        this.focusedHighlight = this._getFocusedHighlights()
        this.caretPlacer.appendChild(this.focusedHighlight)
        return this.currentPosition
    }

    goDown() {
        this.focusedHighlight.remove()
        this._updateCurrentPosition(this.currentPosition + 1)
        this.focusedHighlight = this._getFocusedHighlights()
        this.caretPlacer.appendChild(this.focusedHighlight)
        return this.currentPosition
    }
    /**
     * 
     * @param {Number} newCurrentPosition 
     */
    _updateCurrentPosition(newCurrentPosition) {
        if (newCurrentPosition < this.startingPosition)
            this.currentPosition = this.endingPosition
        else if (newCurrentPosition > this.endingPosition)
            this.currentPosition = this.startingPosition
        else this.currentPosition = newCurrentPosition
    }
}