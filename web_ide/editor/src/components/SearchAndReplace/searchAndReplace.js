import CustomSearchContainer from "./search.js"
import CustomReplaceContainer from "./replace.js"

class CustomSearchReplaceContainer extends HTMLElement {
    constructor() {
        super()
        const searchContainer = new CustomSearchContainer().buildSearchContainer()
        const replaceContainer = new CustomReplaceContainer().buildReplaceContainer()
        this.appendChild(searchContainer)
        this.appendChild(replaceContainer)
    }
}


customElements.define('custom-search-replace-container', CustomSearchReplaceContainer)