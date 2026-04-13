export default class TextFetcher {
    constructor() {
        this.startingIndex = 0
        this.endingIndex = 0
        this.text = ""
    }

    /**
     * 
     * @param {String} fullText 
     */
    selectTextFromFullText(fullText) {
        const lines = fullText.split('\n')
        const lineForEndingPoint = this.highlighter.endingPoint.lineId
        const lineForStartingPoint = this.highlighter.startingPoint.lineId
        if (lineForStartingPoint == lineForEndingPoint) {
            this._singleLineTextSelection()
        }
        else {
            this._multilineTextSelection(lines, lineForStartingPoint, lineForEndingPoint)
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
        this.startingIndex = startingIndex
        this.endingIndex = endingIndex
        this.text = fullText.substring(startingIndex, endingIndex)
    }

    /**
     * 
     * @param {Array} lines 
     * @param {Number} lineForStartingPoint 
     * @param {Number} lineForEndingPoint 
     */
    _multilineTextSelection(lines, lineForStartingPoint, lineForEndingPoint) {
        if (lineForEndingPoint > lineForStartingPoint) {
            return this._startingLineFirst(lines, lineForStartingPoint, lineForEndingPoint)
        }
        else {
            return this._endingLineFirst(lines, lineForEndingPoint, lineForStartingPoint)
        }
    }

    /**
     * 
     * @param {Array} lines 
     * @param {Number} firstLine 
     * @param {Number} lastLine 
     * @returns 
     */
    _startingLineFirst(lines, firstLine, lastLine) {
        const selectedTextLines = []
        const textOfFirstLine = this._getTextForFirstSelectedLine(this.highlighter.startingPoint)
        const textOfEndingLine = this._getOfLastLine(this.highlighter.endingPoint)
        selectedTextLines.push(textOfFirstLine)
        this._getLinesInBetween(lines, firstLine + 1, lastLine, selectedTextLines)
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
     * @param {Array} lines 
     * @param {Number} firstLine 
     * @param {Number} lastLine 
     * @param {Array} linesText 
     */
    _getLinesInBetween(lines, firstLine, lastLine, linesText) {
        for (let index = firstLine; index < lastLine; index++) {
            const lineText = lines[index];
            linesText.push(lineText)
        }
    }

    /**
    * @param {Array} lines 
    * @param {Number} firstLine 
    * @param {Number} lastLine 
    * @returns 
    */
    _endingLineFirst(lines, firstLine, lastLine) {
        const selectedTextLines = []
        const textOfFirstLine = this._getTextForFirstSelectedLine(this.highlighter.endingPoint)
        const textOfEndingLine = this._getOfLastLine(this.highlighter.startingPoint)
        selectedTextLines.push(textOfFirstLine)
        this._getLinesInBetween(lines, firstLine + 1, lastLine, selectedTextLines)
        selectedTextLines.push(textOfEndingLine)
        this.text = selectedTextLines.join('\n')
    }
}