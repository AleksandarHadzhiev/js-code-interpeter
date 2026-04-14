import turnWidthToIndexForText from "../calculators/offsetToTextCalculator.js"
import calculateWidthForText from "../calculators/widthOfTextCalculator.js"
import Highlighter from "./highlighter.js"

export default class TextFetcher {
    /**
     * 
     * @param {Highlighter} highlighter 
     * @param {HTMLElement} contentElement 
     */
    constructor(highlighter, contentElement) {
        this.contentElement = contentElement
        this.highlighter = highlighter
        this.startingIndex = 0
        this.endingIndex = 0
        this.text = ""
        this.textToWorkWith = ""
        this.lines = []
    }

    /**
     * 
     * @param {String} fullText 
     */
    selectTextFromFullText(fullText) {
        this.textToWorkWith = fullText
        this.lines = fullText.split('\n')
        const lineForEndingPoint = this.highlighter.endingPoint.lineId
        const lineForStartingPoint = this.highlighter.startingPoint.lineId
        if (lineForStartingPoint == lineForEndingPoint) {
            this._singleLineTextSelection()
        }
        else {
            this._multilineTextSelection(lineForStartingPoint, lineForEndingPoint)
        }
        return {
            "text": this.text,
            "starting": this.startingIndex,
            "ending": this.endingIndex
        }
    }


    _singleLineTextSelection() {
        const fullText = this.highlighter.startingPoint.fullText
        const fullTextWidth = calculateWidthForText(this.contentElement, fullText)
        const startingIndex = turnWidthToIndexForText(this.highlighter.startingPoint.leftOffset, fullTextWidth, fullText.length)
        const endingIndex = turnWidthToIndexForText(this.highlighter.endingPoint.leftOffset, fullTextWidth, fullText.length)
        this._setPointsFor(startingIndex, endingIndex)
        this.text = fullText.substring(startingIndex, endingIndex)
    }

    /**
     * 
     * @param {Number} startingIndex 
     * @param {Number} endingIndex 
     */
    _setPointsFor(startingIndex, endingIndex) {
        const textInLinesTillFirst = this.lines.slice(0, this.highlighter.startingPoint.lineId)
        const textInLinesTillLast = this.lines.slice(0, this.highlighter.endingPoint.lineId)
        const textFirst = textInLinesTillFirst.join('\n')
        const textLast = textInLinesTillLast.join('\n')
        if (this.highlighter.startingPoint.lineId > 0) {
            this.startingIndex = startingIndex + textFirst.length + 1
            if (this.highlighter.endingPoint > 0)
                this.endingIndex = endingIndex + textLast.length + 1
            else this.endingIndex = endingIndex + textLast.length
        }
        else {
            this.startingIndex = startingIndex + textFirst.length
            if (this.highlighter.endingPoint > 0)
                this.endingIndex = endingIndex + textLast.length + 1
            else this.endingIndex = endingIndex + textLast.length
        }
    }

    /**
     * 
     * @param {Number} lineForStartingPoint 
     * @param {Number} lineForEndingPoint 
     */
    _multilineTextSelection(lineForStartingPoint, lineForEndingPoint) {
        if (lineForEndingPoint > lineForStartingPoint) {
            return this._startingLineFirst(lineForStartingPoint, lineForEndingPoint)
        }
        else {
            return this._endingLineFirst(lineForEndingPoint, lineForStartingPoint)
        }
    }

    /**
     * 
     * @param {Number} firstLine 
     * @param {Number} lastLine 
     * @returns 
     */
    _startingLineFirst(firstLine, lastLine) {
        const selectedTextLines = []
        const textOfFirstLine = this._getTextForFirstSelectedLine(this.highlighter.startingPoint)
        const textOfEndingLine = this._getOfLastLine(this.highlighter.endingPoint)
        selectedTextLines.push(textOfFirstLine)
        this._getLinesInBetween(firstLine + 1, lastLine, selectedTextLines)
        selectedTextLines.push(textOfEndingLine)
        this.text = selectedTextLines.join('\n')
    }
    _getTextForFirstSelectedLine(point) {
        const fullText = point.fullText
        const fullTextWidth = calculateWidthForText(this.contentElement, fullText)
        const startingIndex = turnWidthToIndexForText(point.leftOffset, fullTextWidth, fullText.length)
        this.startingIndex = startingIndex
        return fullText.substring(startingIndex, fullText.length - 1)
    }

    _getOfLastLine(point) {
        const fullText = point.fullText
        const fullTextWidth = calculateWidthForText(this.contentElement, fullText)
        const startingIndex = 0
        const endingIndex = turnWidthToIndexForText(point.leftOffset, fullTextWidth, fullText.length)
        this.endingIndex = endingIndex
        return fullText.substring(startingIndex, endingIndex)
    }

    /**
     * 
     * @param {Number} firstLine 
     * @param {Number} lastLine 
     * @param {Array} linesText 
     */
    _getLinesInBetween(firstLine, lastLine, linesText) {
        for (let index = firstLine; index < lastLine; index++) {
            const lineText = this.lines[index];
            linesText.push(lineText)
        }
    }

    /**
    * @param {Number} firstLine 
    * @param {Number} lastLine 
    * @returns 
    */
    _endingLineFirst(firstLine, lastLine) {
        const selectedTextLines = []
        const textOfFirstLine = this._getTextForFirstSelectedLine(this.highlighter.endingPoint)
        const textOfEndingLine = this._getOfLastLine(this.highlighter.startingPoint)
        selectedTextLines.push(textOfFirstLine)
        this._getLinesInBetween(firstLine + 1, lastLine, selectedTextLines)
        selectedTextLines.push(textOfEndingLine)
        this.text = selectedTextLines.join('\n')
    }
}