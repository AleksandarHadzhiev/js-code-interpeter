import LineBUilder from "../lineBuilder.js"
import Line from "./Line.js"
import LineSelector from "../selectionMechanisms/lineSelector.js"

export default class LinesLoader {
    /**
     * @param {Number} maxVisibleLinesOnScreen 
     * @param {Number} minLineHeight  
    */
    constructor(maxVisibleLinesOnScreen, minLineHeight) {
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.contentElement = document.getElementById('content')
        this.firstVisibleLine = 0
        this.lastVisibleLine = this.firstVisibleLine + maxVisibleLinesOnScreen
        this.maxVisibleLinesOnScreen = maxVisibleLinesOnScreen
        this.previousLastVisibleLine = this.lastVisibleLine
        this.lineHeightInPixels = minLineHeight
        this.maxLines = 0
        this.textToWorkWith = ""
        this.linesToWorkWith = ""
    }

    /**
     * 
     * @param {String} text 
     */
    loadContentForText(text) {
        this.textToWorkWith = text
        this.linesToWorkWith = text.split('\n')
        this.maxLines = this.linesToWorkWith.length
        this._buildLines()
    }

    updateMaxVisibleLinesOnScreen(newMaxVisibleLinesOnScreen) {
        this.maxVisibleLinesOnScreen = newMaxVisibleLinesOnScreen
    }

    /**
     * @param {Function} updateWidths 
     */
    loadLines(updateWidths) {
        this._buildLines()
        updateWidths()
    }

    _buildLines() {
        for (let index = this.firstVisibleLine; index < this.lastVisibleLine; index++) {
            this._buildLineForIndex(index)
        }
    }

    /**
     * 
     * @param {Number} index 
     */
    _buildLineForIndex(index) {
        const line = new Line(index, this.linesToWorkWith)
        this._addNumerationElementToSection(line)
        this._addLineContentToContent(line)
    }

    /**
     * 
     * @param {Line} line 
     */
    _addNumerationElementToSection(line) {
        const lineNumeration = this._buildLineNumerationElementForLine(line)
        if (document.getElementById(`numeration-${line.index}`) == null) {
            this.lineNumerationElement.appendChild(lineNumeration)
        }
    }

    /**
     * 
     * @param {Line} line 
     * @returns {HTMLElement}
     */
    _buildLineNumerationElementForLine(line) {
        const lineNumeration = document.createElement('span')
        lineNumeration.classList.add('numeration')
        lineNumeration.setAttribute('id', `numeration-${line.index}`)
        lineNumeration.style = `top:${line.index * this.lineHeightInPixels}px;`
        lineNumeration.textContent = line.numeration
        return lineNumeration
    }

    /**
     * 
     * @param {Line} line 
     */
    _addLineContentToContent(line) {
        const lineContent = this._buildLineWithContent(line)
        if (document.getElementById(`${line.index}`) == null) {
            this.lineContentElement.appendChild(lineContent)
        }
    }

    /**
     * 
     * @param {Line} line 
     * @returns {HTMLElement}
     */
    _buildLineWithContent(line) {
        const builder = new LineBUilder(line.content)
        const lineElement = builder.buildLine(line.index)
        lineElement.classList.add('line-content')
        lineElement.style = `top:${line.index * this.lineHeightInPixels}px;`
        lineElement.addEventListener('mousedown', (event) => {
            const lineSeleect = document.getElementById('line-selector')
            if (lineSeleect) lineSeleect.remove()
        })
        lineElement.addEventListener('mouseup', (event) => {
            const range = document.getSelection().getRangeAt(0)
            const isSameIndex = range.endOffset == range.startOffset
            const isSameElement = range.startContainer.parentElement.offsetLeft == range.endContainer.parentElement.offsetLeft
            const isSameLine = range.startContainer.parentElement.parentElement.offsetTop == range.endContainer.parentElement.parentElement.offsetTop
            if (isSameIndex && isSameElement && isSameLine) {
                const lineSelector = new LineSelector(event, this.contentElement)
                lineSelector.selectLine()
            }
        })
        return lineElement
    }

    resizeLines() {
        this.lastVisibleLine = this.firstVisibleLine + this.maxVisibleLinesOnScreen
        this._reloadLinesForResize()
        this.previousLastVisibleLine = this.lastVisibleLine
    }

    _reloadLinesForResize() {
        if (this.lastVisibleLine < this.previousLastVisibleLine) {
            this._removeAdditionalLines()
        }
        else if (this.lastVisibleLine > this.previousLastVisibleLine) {
            this._buildNeededLines()
        }
    }

    _removeAdditionalLines() {
        for (let index = this.previousLastVisibleLine; index > this.lastVisibleLine; index--) {
            const lineElement = document.getElementById(String(index));
            if (lineElement) {
                const lineNumeration = document.getElementById(`numeration-${index}`)
                lineElement.remove()
                lineNumeration.remove()
            }
        }
    }

    _buildNeededLines() {
        for (let index = this.previousLastVisibleLine; index <= this.lastVisibleLine; index++) {
            const lineElement = document.getElementById(String(index));
            if (lineElement == null) {
                this._buildLineForIndex(index)
            }
        }
    }

    reloadLinesForNewTopOffset(offset) {
        this.firstVisibleLine = Math.floor(offset / this.lineHeightInPixels)
        if (this.firstVisibleLine <= this.maxLines) {
            this.lastVisibleLine = this.firstVisibleLine + this.maxVisibleLinesOnScreen
            this.reloadDisplayedLines()
            this.previousLastVisibleLine = this.lastVisibleLine
        }
    }

    reloadDisplayedLines() {
        if (this.lastVisibleLine > this.previousLastVisibleLine)
            this._refreshlinesOnScrollingDown()
        else
            this._refreshLinesOnScrollingUp()
    }

    _refreshlinesOnScrollingDown() {
        const linesElements = this.lineNumerationElement.childNodes
        linesElements.forEach(lineElement => {
            const lineId = Number(String(lineElement.id).replace('numeration-', ''))
            if (lineId < this.firstVisibleLine) {
                const distance = this.previousLastVisibleLine - lineId
                const newId = this.firstVisibleLine + distance - 1
                if (newId <= this.maxLines) {
                    this._updateLineNumerationWithNewId(lineElement, newId)
                    this._updateContentForIdWithNewId(lineId, newId)
                }
                else {
                    this._emptyLineNumeration(lineElement, newId)
                    this._emptyLineContent(lineId, newId)
                }
            }
        });
    }

    _updateLineNumerationWithNewId(lineElement, newId) {
        lineElement.setAttribute('id', `numeration-${newId}`)
        lineElement.style = `top:${newId * this.lineHeightInPixels}px;`
        lineElement.textContent = newId + 1
    }

    _updateContentForIdWithNewId(lineId, newId) {
        const lineContent = document.getElementById(`${lineId}`)
        const line = new Line(newId, this.linesToWorkWith)
        const newInnerHTML = new LineBUilder(line.content)._buildWordsForLine()
        lineContent.innerHTML = newInnerHTML
        lineContent.setAttribute('id', `${newId}`)
        lineContent.style = `top:${newId * this.lineHeightInPixels}px;`
    }

    _emptyLineNumeration(lineElement, newId) {
        lineElement.setAttribute('id', `numeration-${newId}`)
        lineElement.style = `top:${newId * this.lineHeightInPixels}px; pointer-events: none;`
        lineElement.textContent = ""
    }

    _emptyLineContent(lineId, newId) {
        const lineContent = document.getElementById(`${lineId}`)
        lineContent.innerHTML = ""
        lineContent.setAttribute('id', `${newId}`)
        lineContent.style = `pointer-events: none; top:${newId * this.lineHeightInPixels}px;`
    }

    _refreshLinesOnScrollingUp() {
        const linesElements = this.lineNumerationElement.childNodes
        linesElements.forEach(lineElement => {
            const lineId = Number(String(lineElement.id).replace('numeration-', ''))
            if (lineId >= this.lastVisibleLine) {
                const distance = this.previousLastVisibleLine - lineId
                const newId = this.firstVisibleLine + distance - 1
                this._updateLineNumerationWithNewId(lineElement, newId)
                this._updateContentForIdWithNewId(lineId, newId)
            }
        });
    }

}