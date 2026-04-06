import { textToWokWith } from "../../textToWorkWith.js";
import HighlightProvider from "./highlighters/HighlightProvider.js";

export default class SearchHandler {
    constructor() {
        this.search = document.getElementById('search-container')
        this.searchField = document.getElementById('search-field')
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
        const highlightProvider = new HighlightProvider(textToSearchFor, this.textToWokWith)
        const highlights = highlightProvider.getHighlightedElementsAfterHighlightingThem()
        this.amountOfAppearences = `0 of ${highlights.length}`
        this.infoForAmountOfAppearencesOfText.textContent = this.amountOfAppearences

    }
}