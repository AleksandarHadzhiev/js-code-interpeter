import LineBUilder from "../lineBuilder.js"
import Line from "./Line.js"
import LineSelector from "../selectionMechanisms/lineSelector.js"

export default class LinesLoader {
    /**
     * @param {Number} maxVisibleLinesOnScreen 
     * @param {HTMLElement} lineNumerationElement  
     * @param {HTMLElement} lineContentElement  
    */
    constructor(maxVisibleLinesOnScreen, lineNumerationElement, lineContentElement) {
        this.firstVisibleLine = 0
        this.lastVisibleLine = this.firstVisibleLine + maxVisibleLinesOnScreen
        this.maxVisibleLinesOnScreen = maxVisibleLinesOnScreen
        this.previousLastVisibleLine = this.lastVisibleLine
        this.lineNumerationElement = lineNumerationElement
        this.lineContentElement = lineContentElement
        this.lineHeightInPixels = 28.8
        this.maxLines = 2000
    }

    loadLines() {
        for (let index = this.firstVisibleLine; index < this.lastVisibleLine; index++) {
            this._buildLineForIndex(index)
        }
    }

    /**
     * 
     * @param {Number} index 
     */
    _buildLineForIndex(index) {
        const line = new Line(index)
        this._addNumerationElementToSection(line)
        this._addLineContentToContent(line)
    }

    /**
     * 
     * @param {Line} line 
     */
    _addNumerationElementToSection(line) {
        const lineNumeration = this._buildLineNumerationElementForLine(line)
        this.lineNumerationElement.appendChild(lineNumeration)
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
        this.lineContentElement.appendChild(lineContent)
    }

    /**
     * 
     * @param {Line} line 
     * @returns {HTMLElement}
     */
    _buildLineWithContent(line) {
        const builder = new LineBUilder(line.content)
        const lineElement = builder.buildLine()
        lineElement.classList.add('line-content')
        lineElement.setAttribute('id', String(line.index))
        lineElement.style = `top:${line.index * this.lineHeightInPixels}px;`
        lineElement.addEventListener('mouseup', (event) => {
            const lineSelector = new LineSelector(event)
            lineSelector.selectLine()
        })
        return lineElement
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
        const line = new Line(newId)
        const newInnerHTML = new LineBUilder(line.content)._buildWordsForLine()
        lineContent.innerHTML = newInnerHTML
        lineContent.setAttribute('id', `${newId}`)
        lineContent.style = `top:${newId * this.lineHeightInPixels}px;`
    }

    _emptyLineNumeration(lineElement, newId) {
        lineElement.setAttribute('id', `numeration-${newId}`)
        lineElement.style = `top:${newId * this.lineHeightInPixels}px;`
        lineElement.textContent = ""
    }

    _emptyLineContent(lineId, newId) {
        const lineContent = document.getElementById(`${lineId}`)
        lineContent.innerHTML = ""
        lineContent.setAttribute('id', `${newId}`)
        lineContent.style = `top:${newId * this.lineHeightInPixels}px;`
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