import { textToWokWith } from "../../textToWorkWith";

export default class SearchHandler {
    constructor() {
        this.search = document.getElementById('search-container')
        this.class = 'hidden'
        this.textToWokWith = textToWokWith
    }

    changeVisibility() {
        console.log(this.textToWokWith)
        this.class = this.class == "hidden" ? "search-container" : "hidden"
        this.search.className = this.class
    }
}