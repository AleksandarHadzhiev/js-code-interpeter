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
        this.searchField.addEventListener('input', (event) => {
            this.firstVisibleLine = linesLoader.firstVisibleLine
            this._searchForText()
        })
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

    _higlightTextDifferentThanEmpty(textToSearchFor) {
        this._singleLineHighlighter(textToSearchFor)
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
        this.widthOfTextToHighlight = calculateWidthForText(this.lineContent, this.textToSearchFor)
        this._singleLineHighlightCheckInFullText(text).then((numberOfAppearences) => {
            this._updateInfo(numberOfAppearences)
        })
        this._highlightTextVisibleOnScreen(text)
    }

    _singleLineHighlightCheckInFullText(textToSearchFor) {
        return new Promise(function (resolve, reject) {
            let amountOfAppearences = 0
            try {
                const matches = textToWokWith.matchAll(textToSearchFor)
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
            this._buildCoordinatesToHighlight(match, lineText, topOffset, width, this.lineContent)
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
    _buildCoordinatesToHighlight(match, lineText, topOffset, width, lineContent) {
        return new Promise(function (resolve, reject) {
            try {
                const text = lineText.substring(0, match.index)
                const leftOffset = calculateWidthForText(lineContent, text)
                resolve(new Coordinates(width, leftOffset, topOffset))
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
            left: ${coordinates.left}px;
        `
        return highlight
    }

    updateOnScrolling() {
        if (this.class !== "hidden") {
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
            if (lineElement == null) highlightedLine.class = 'hidden'
        })
    }
}