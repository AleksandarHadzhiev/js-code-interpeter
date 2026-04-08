import { textToWokWith } from "../../textToWorkWith.js";
import calculateWidthForText from "./calculators/widthOfTextCalculator.js";
import LinesLoader from "./scrollingMechanisms/LinesLoader.js";

class Coordinates {
    /**
     * 
     * @param {Number} width 
     * @param {Number} left 
     * @param {Number} top 
     */
    constructor(width, left, top) {
        this.width = width
        this.left = left
        this.top = top
    }
}

export default class SearchHandler {
    /**
     * 
     * @param {LinesLoader} linesLoader 
     */
    constructor(linesLoader) {
        this.search = document.getElementById('search-container')
        this.searchField = document.getElementById('search-field')
        this.lineContent = document.getElementById('line-content')
        this.placer = document.getElementById('caret-placer')
        this.loader = document.getElementById('loader')
        this.textToSearchFor = ""
        this.textToSearchForWithEscapedRegex = ""
        this.textToSearchForLength = 0
        this.infoForAmountOfAppearencesOfText = document.getElementById(`info-highlighted-lines`)
        this.class = 'hidden'
        this.amountOfAppearences = "No results"
        this.textToWokWith = textToWokWith
        this.highlighter = null
        this.linesLoader = linesLoader
        this.firstVisibleLine = linesLoader.firstVisibleLine
        this.lastVisibleLine = linesLoader.lastVisibleLine
        this.searchField.addEventListener('input', (event) => {
            this.firstVisibleLine = linesLoader.firstVisibleLine
            this.lastVisibleLine = linesLoader.lastVisibleLine
            this._searchForText()
        })
        this.searchField.addEventListener('keydown', (event) => {
            const isPastingText = event.key == "c" || event.key == "C"
            if (event.ctrlKey && isPastingText) {
                this.firstVisibleLine = linesLoader.firstVisibleLine
                this.lastVisibleLine = linesLoader.lastVisibleLine
                this._searchForText()
            }
        })
    }

    _stripTextFromLineToLine() {
        const lines = this.textToWokWith.split('\n')
        const text = lines.slice(this.firstVisibleLine, this.lastVisibleLine)
        return text.join('\n').toLowerCase()
    }

    changeVisibility() {
        this.class = this.class == "hidden" ? "search-container" : "hidden"
        this.search.className = this.class
    }

    _searchForText() {
        this._buildAHighlighter()
        const textToSearchFor = String(this.searchField.value).toLowerCase()
        if (textToSearchFor.trim() !== "") {
            this._higlightTextDifferentThanEmpty(textToSearchFor)
        }
        else {
            this.amountOfAppearences = `No results`
            this.infoForAmountOfAppearencesOfText.textContent = this.amountOfAppearences
        }
    }

    _buildAHighlighter() {
        let highlighter = document.getElementById('highlighter')
        if (highlighter == null) {
            highlighter = document.createElement('div')
            highlighter.setAttribute('id', 'highlighter')
            this.placer.appendChild(highlighter)
        }
        else {
            highlighter.replaceChildren()
        }
        this.highlighter = highlighter
    }

    /**
     * 
     * @param {String} textToSearchFor 
     */
    _higlightTextDifferentThanEmpty(textToSearchFor) {
        this.widthOfTextToHighlight = calculateWidthForText(this.lineContent, textToSearchFor)
        const lines = textToSearchFor.split('\n')
        if (lines.length > 1)
            this._multilineHighlighter(textToSearchFor, lines)
        else
            this._singleLineHighlighter(textToSearchFor)
    }

    /**
     * 
     * @param {String} textToSearchFor 
     * @param {Array} lines 
     */
    _multilineHighlighter(textToSearchFor, lines) {
        const text = textToSearchFor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\n', '[\\n]');
        this.textToSearchFor = textToSearchFor
        this.textToSearchForWithEscapedRegex = text
        this.textToSearchForLength = textToSearchFor.length
        this._catchAllAppearancesInFullText(text).then((numberOfAppearences) => {
            this._updateInfo(numberOfAppearences)
        })
        this._highlightMultilineSearchOnScreen(text, lines)
    }

    _catchAllAppearancesInFullText(textToSearchFor) {
        return new Promise(function (resolve, reject) {
            let amountOfAppearences = 0
            try {
                const matches = textToWokWith.toLowerCase().matchAll(textToSearchFor)
                matches.forEach((match, index) => {
                    amountOfAppearences += 1
                })
                resolve(amountOfAppearences)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    _updateInfo(numberOfAppearences) {
        this.amountOfAppearences = `0 of ${numberOfAppearences}`
        this.infoForAmountOfAppearencesOfText.textContent = this.amountOfAppearences
    }

    /**
     * 
     * @param {String} textToSearchFor 
     * @param {Array} lines 
     */
    _highlightMultilineSearchOnScreen(textToSearchFor, lines) {
        const text = this._stripTextFromLineToLine()
        try {
            const matches = text.matchAll(textToSearchFor)
            matches.forEach((match) => {
                const textBefore = text.substring(0, match.index)
                let lineId = textBefore.split('\n').length - 1
                lineId = this.firstVisibleLine + lineId
                const topOffset = lineId * 28.8
                let lineHighlighter = document.getElementById(`${lineId}-highlighter`)
                if (lineHighlighter) {
                    if (lineHighlighter.classList.contains('hidden'))
                        lineHighlighter.classList.remove('hidden')
                }
                else {
                    lineHighlighter = this._buildLineHighlighter(lineId, topOffset)
                    const lineElement = document.getElementById(String(lineId))
                    lineElement.offsetWidth
                    const widths = this._buildWidths(lines)
                    const widthForFirstLine = calculateWidthForText(this.lineContent, lineElement.textContent)
                    const leftOffset = widthForFirstLine - widths[0]
                    widths.forEach((width, index) => {
                        let coordinates = new Coordinates(width, leftOffset, index * 28.8)
                        if (index != 0) coordinates.left = 0
                        const higlight = this._buildHighlight(coordinates, lineHighlighter)
                        lineHighlighter.appendChild(higlight)
                    })
                    this.highlighter.appendChild(lineHighlighter)
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    /**
     * 
     * @param {Array} lines 
     */
    _buildWidths(lines) {
        const widths = []
        lines.forEach((line) => {
            const width = calculateWidthForText(this.lineContent, line)
            widths.push(width)
        })
        return widths
    }

    /**
     * 
     * @param {String} textToSearchFor 
     */
    _singleLineHighlighter(textToSearchFor) {
        const text = textToSearchFor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.textToSearchFor = textToSearchFor
        this.textToSearchForWithEscapedRegex = text
        this.textToSearchForLength = textToSearchFor.length
        this._catchAllAppearancesInFullText(text).then((numberOfAppearences) => {
            this._updateInfo(numberOfAppearences)
        })
        this._highlightTextVisibleOnScreen(text)
    }

    /**
     * 
     * @param {String} textToSearchFor 
     * @returns 
     */
    _highlightTextVisibleOnScreen(textToSearchFor) {
        const lines = this.lineContent.childNodes
        try {
            const width = this.widthOfTextToHighlight
            lines.forEach((lineELement) => {
                this._highlightTextForLine(lineELement, textToSearchFor, width)
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    /**
     * 
     * @param {HTMLElement} lineELement 
     * @param {String} textToSearchFor 
     * @param {Number} width
     */
    _highlightTextForLine(lineELement, textToSearchFor, width) {
        const lineText = lineELement.textContent.toLowerCase()
        const lineId = lineELement.id
        const topOffset = lineId * 28.8
        const matchesOnLine = lineText.matchAll(textToSearchFor)
        const lineHighlighter = this._buildLineHighlighter(lineId, topOffset)
        matchesOnLine.forEach((match, index) => {
            this._buildCoordinatesToHighlight(match, lineText, width, this.lineContent)
                .then((coordinatesToHighlight) => {
                    const higlight = this._buildHighlight(coordinatesToHighlight, lineHighlighter)
                    lineHighlighter.appendChild(higlight)
                })
        })
        this.highlighter.appendChild(lineHighlighter)

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
 * @param {RegExpExecArray} match 
 * @param {String} lineText 
 * @param {Number} topOffset 
 * @param {Number} width 
 * @param {HTMLElement} lineContent 
 * @returns 
 */
    _buildCoordinatesToHighlight(match, lineText, width, lineContent) {
        return new Promise(function (resolve, reject) {
            try {
                const text = lineText.substring(0, match.index)
                const leftOffset = calculateWidthForText(lineContent, text)
                resolve(new Coordinates(width, leftOffset, 0))
            } catch (error) {
                reject(error)
            }
        })
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
            background-color: orange;
            width: ${coordinates.width}px;
            height: 28.8px;
            top: ${coordinates.top}px;
            left: ${coordinates.left}px;
        `
        return highlight
    }

    updateOnScrolling() {
        if (this.class !== "hidden") {
            const lines = this.textToSearchFor.split('\n')
            if (lines.length <= 1)
                this._singleLineSearch()
            else
                this._multilineSearch(lines)
        }
    }

    _singleLineSearch() {
        const distance = this.linesLoader.firstVisibleLine > this.firstVisibleLine
            ? this.linesLoader.firstVisibleLine - this.firstVisibleLine
            : this.firstVisibleLine - this.linesLoader.firstVisibleLine

        if (distance < this.linesLoader.maxVisibleLinesOnScreen)
            this._updateLineByLine()
        else {
            this._buildAHighlighter()
            this._singleLineHighlighter(this.textToSearchFor)

        }
        this.firstVisibleLine = this.linesLoader.firstVisibleLine
    }

    _updateLineByLine() {
        const lines = this.lineContent.childNodes
        lines.forEach((line) => {
            const id = line.id
            const highlightedLine = document.getElementById(`${id}-highlighter`)
            if (highlightedLine == null)
                this._highlightTextForLine(line, this.textToSearchForWithEscapedRegex, this.widthOfTextToHighlight)
            else if (highlightedLine.classList.contains('hidden'))
                highlightedLine.classList.remove('hidden')
        })
        this.highlighter.childNodes.forEach((highlightedLine) => {
            const id = String(highlightedLine.id).replace(`-highlighter`, '')
            const lineElement = document.getElementById(String(id))
            if (lineElement == null) highlightedLine.classList.add('hidden')
        })
    }

    /**
     * 
     * @param {Array} lines 
     */
    _multilineSearch(lines) {
        const distance = this.linesLoader.firstVisibleLine > this.firstVisibleLine
            ? this.linesLoader.firstVisibleLine - this.firstVisibleLine
            : this.firstVisibleLine - this.linesLoader.firstVisibleLine
        this.firstVisibleLine = this.linesLoader.firstVisibleLine
        this.lastVisibleLine = this.linesLoader.lastVisibleLine
        if (distance < this.linesLoader.maxVisibleLinesOnScreen)
            this._nultilineUpdateOnSlowScrolling(lines)
        else {
            this._buildAHighlighter()
            this._multilineHighlighter(this.textToSearchFor, lines)
        }
    }

    _nultilineUpdateOnSlowScrolling(lines) {
        this._multilineHighlighter(this.textToSearchFor, lines)
        this.highlighter.childNodes.forEach((highlightedLine) => {
            const id = String(highlightedLine.id).replace(`-highlighter`, '')
            const lineElement = document.getElementById(String(id))
            if (lineElement == null) highlightedLine.classList.add('hidden')
        })
    }
}