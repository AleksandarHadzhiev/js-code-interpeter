import { textToWokWith } from "../../textToWorkWith.js";
import calculateWidthForText from "./calculators/widthOfTextCalculator.js";

export default class SearchHandler {
    constructor() {
        this.search = document.getElementById('search-container')
        this.searchField = document.getElementById('search-field')
        this.lineContent = document.getElementById('line-content')
        this.infoForAmountOfAppearencesOfText = document.getElementById(`info-highlighted-lines`)
        this.class = 'hidden'
        this.amountOfAppearences = "No results"
        this.textToWokWith = textToWokWith

        this.searchField.addEventListener('input', (event) => {
            this._searchForText()
        })
    }

    changeVisibility() {
        this.class = this.class == "hidden" ? "search-container" : "hidden"
        this.search.className = this.class
    }

    _searchForText() {
        const textToSearchFor = String(this.searchField.value).toLowerCase()
        if (textToSearchFor.trim() !== "") {
            this._higlightTextDifferentThanEmpty(textToSearchFor)
        }
        else {
            this.amountOfAppearences = `No results`
            this.infoForAmountOfAppearencesOfText.textContent = this.amountOfAppearences
        }
    }

    _higlightTextDifferentThanEmpty(textToSearchFor) {
        this._singleLineHighlighter(textToSearchFor)
    }

    _singleLineHighlighter(textToSearchFor) {
        this._singleLineHighlightCheckInFullText(textToSearchFor).then((numberOfAppearences) => {
            this._updateInfo(numberOfAppearences)
        })
        this._highlightTextVisibleOnScreen(textToSearchFor).then((highlighters) => {
            this._buildHighlighters(highlighters)
        })
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
        console.log(numberOfAppearences)
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
        return new Promise(function (resolve, reject) {
            const highlighters = []
            try {
                lines.forEach((lineELement) => {
                    const parent = lineELement.parentElement
                    const lineText = lineELement.textContent
                    const topOffset = lineELement.id * 28.8
                    const matchesOnLine = lineText.matchAll(textToSearchFor)
                    matchesOnLine.forEach((match, index) => {
                        const text = lineText.substring(0, match.index)
                        const textForWidth = lineText.substring(match.index, match.index + textToSearchFor.length)
                        const leftOffset = calculateWidthForText(parent, text)
                        const width = calculateWidthForText(parent, textForWidth)
                        highlighters.push({ "width": width, "left": leftOffset, "top": topOffset })
                    })
                })
                resolve(highlighters)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @param {Array} highlighters 
     */
    _buildHighlighters(highlighters) {
        console.log(highlighters)
    }
}