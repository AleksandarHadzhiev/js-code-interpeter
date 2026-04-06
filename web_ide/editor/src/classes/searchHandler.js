import { textToWokWith } from "../../textToWorkWith.js";
import HighlightProvider from "./highlighters/HighlightProvider.js";

export default class SearchHandler {
    constructor() {
        this.search = document.getElementById('search-container')
        this.searchField = document.getElementById('search-field')
        this.class = 'hidden'
        this.textToWokWith = textToWokWith

        this.searchField.addEventListener('input', (event) => {
            this._searchForText()
        })
    }

    changeVisibility() {
        console.log(this.textToWokWith)
        this.class = this.class == "hidden" ? "search-container" : "hidden"
        this.search.className = this.class
    }

    _searchForText() {
        const textToSearchFor = this.searchField.value
        const highlightProvider = new HighlightProvider(textToSearchFor, this.textToWokWith)
        const highlights = highlightProvider.getHighlightedElementsAfterHighlightingThem()
        console.log(highlights)
    }
}