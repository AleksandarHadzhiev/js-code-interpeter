import LinesLoader from "../scrollingMechanisms/LinesLoader.js";
import SearchHandler from "../searchReplace/searchHandler.js";
import ReplaceHandler from "./replaceHandler.js";

export default class SearchReplaceHandler {
    /**
     * 
     * @param {LinesLoader} linesLoader 
     */
    constructor(linesLoader) {
        this.searchHandler = new SearchHandler(linesLoader)
        this.replaceHandler = new ReplaceHandler(linesLoader)
        this.searchRaplce = document.getElementById("search-replace")
        this.class = "hidden"
    }

    changeVisibility() {
        this.class = this.class == "hidden" ? "search-replace" : "hidden"
        this.searchRaplce.className = this.class
    }

    updateOnScrolling() {
        this.searchHandler.updateOnScrolling()
    }

    /**
     * 
     * @param {String} selectedText 
     */
    setSelectedText(selectedText) {
        this.searchHandler.setSelectedText(selectedText)
        this.replaceHandler.setSelectedText(selectedText)
    }
}