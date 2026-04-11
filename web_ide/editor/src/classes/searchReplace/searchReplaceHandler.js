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
        this.linesLoader = linesLoader
        this.searchReplace = document.getElementById("search-replace")
        this.replaceOne = document.getElementById("replace-one")
        this.replaceAll = document.getElementById("replace-all")
        this.closeSearchReplace = document.getElementById(`close-search-replace`)
        this.class = "hidden"

        this.closeSearchReplace.addEventListener('click', () => {
            this.class = 'hidden'
            this.searchReplace.className = this.class
        })

        this.replaceOne.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToReplace)
            this.replaceHandler.replaceOne()
        })

        this.replaceAll.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToReplace)
            const newTextToWorkWith = this.replaceHandler.replaceAll()
            this.linesLoader.updateFullContent(newTextToWorkWith)
            this.searchHandler.updateTextToWorkWith(newTextToWorkWith)
            this.searchHandler.updateOnReplaceAll()
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