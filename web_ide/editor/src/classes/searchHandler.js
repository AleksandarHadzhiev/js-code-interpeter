import { textToWokWith } from "../../textToWorkWith.js";

export default class SearchHandler {
    constructor() {
        this.search = document.getElementById('search-container')
        this.searchField = document.getElementById('search-field')
        this.class = 'hidden'
        this.textToWokWith = textToWokWith

        this.searchField.addEventListener('input', (event) => {
            const textToSearchFor = this.searchField.value
            // how to properly search for the text?
            console.log(textToSearchFor)
        })
    }

    changeVisibility() {
        console.log(this.textToWokWith)
        this.class = this.class == "hidden" ? "search-container" : "hidden"
        this.search.className = this.class
    }
}