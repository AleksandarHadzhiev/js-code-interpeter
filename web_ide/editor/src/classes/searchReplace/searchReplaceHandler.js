import LinesLoader from "../scrollingMechanisms/LinesLoader.js";
import SearchHandler from "../searchReplace/searchHandler.js";
import ReplaceHandler from "./replaceHandler.js";

export default class SearchReplaceHandler {
    /**
     * 
     * @param {LinesLoader} linesLoader 
     * @param {String} textToWorkWith
     */
    constructor(linesLoader, textToWorkWith) {
        this.searchHandler = new SearchHandler(linesLoader, textToWorkWith)
        this.replaceHandler = new ReplaceHandler(linesLoader, textToWorkWith)
        this.searchReplace = document.getElementById("search-replace")
        this.replaceOne = document.getElementById("replace-one")
        this.replaceAll = document.getElementById("replace-all")
        this.class = "hidden"

        this.replaceOne.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToSearchFor)
            this.replaceHandler.replaceOne()
        })

        this.replaceAll.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToSearchFor)
            this.replaceHandler.replaceAll()
        })
    }

    changeVisibility() {
        this.class = this.class == "hidden" ? "search-replace" : "hidden"
        this.searchReplace.className = this.class
    }

    updateOnScrolling() {
        if (this.class !== "hidden") {
            this.searchHandler.updateOnScrolling()
        }
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