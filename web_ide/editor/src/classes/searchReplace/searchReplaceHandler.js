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
        this.searchReplace = document.getElementById("search-replace")
        this.replaceOne = document.getElementById("replace-one")
        this.replaceAll = document.getElementById("replace-all")
        this.class = "hidden"

        this.replaceOne.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToSearchForWithEscapedRegex)
        })

        this.replaceAll.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToSearchForWithEscapedRegex)
        })
    }

    changeVisibility() {
        this.class = this.class == "hidden" ? "search-replace" : "hidden"
        this.searchReplace.className = this.class
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