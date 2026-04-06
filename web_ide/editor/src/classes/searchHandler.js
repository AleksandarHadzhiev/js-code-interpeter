export default class SearchHandler {
    constructor() {
        this.search = document.getElementById('search-container')
        this.class = 'hidden'
    }

    changeVisibility() {
        this.class = this.class == "hidden" ? "search-container" : "hidden"
        this.search.className = this.class
    }
}