import { BarHorizontalHandler, BarVerticalHandler } from "../scrollingMechanisms/BarHandler.js";
import LinesLoader from "../scrollingMechanisms/LinesLoader.js";
import LoaderHandler from "../scrollingMechanisms/LoaderHandler.js";
import SearchHandler from "../searchReplace/searchHandler.js";
import ReplaceHandler from "./replaceHandler.js";
import SwitchHandler from "./switchHandler.js";

export default class SearchReplaceHandler {
    /**
     * 
     * @param {LinesLoader} linesLoader 
     * @param {String} textToWorkWith
     * @param {LoaderHandler} loaderHandler
     * @param {BarVerticalHandler} barVerticalHandler
     * @param {BarHorizontalHandler} barHorizontalHandler
     */
    constructor(linesLoader, textToWorkWith, loaderHandler, barVerticalHandler, barHorizontalHandler) {
        this.switchHandler = new SwitchHandler(textToWorkWith, loaderHandler, barVerticalHandler, barHorizontalHandler, linesLoader)
        this.searchHandler = new SearchHandler(linesLoader, textToWorkWith, this.switchHandler)
        this.replaceHandler = new ReplaceHandler(linesLoader, textToWorkWith)
        this.linesLoader = linesLoader
        this.searchReplace = document.getElementById("search-replace")
        this.goUpButton = document.getElementById('go-up')
        this.goDownButton = document.getElementById('go-down')
        this.replaceAll = document.getElementById("replace-all")
        this.replaceOne = document.getElementById("replace-one")
        this.closeSearchReplace = document.getElementById(`close-search-replace`)
        this.class = "hidden"

        this.closeSearchReplace.addEventListener('click', () => {
            this.class = 'hidden'
            this.searchReplace.className = this.class
            const highlighter = document.getElementById('highlighter')
            if (highlighter) highlighter.remove()
        })

        this.replaceOne.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToReplace)
            const index = this.switchHandler.highlights.get(this.switchHandler.currentPosition)
            const newText = this.replaceHandler.replaceOne(index)
            this.linesLoader.updateFullContent(newText)
            this.searchHandler.updateTextToWorkWith(newText)
            this.switchHandler.updateTextToWorkWith(newText)
            this.searchHandler.updateOnReplaceOne()
        })

        this.replaceAll.addEventListener('click', () => {
            this.replaceHandler.setTextToReplace(this.searchHandler.textToReplace)
            const newTextToWorkWith = this.replaceHandler.replaceAll()
            this.linesLoader.updateFullContent(newTextToWorkWith)
            this.searchHandler.updateTextToWorkWith(newTextToWorkWith)
            this.switchHandler.updateTextToWorkWith(newTextToWorkWith)
            this.searchHandler.updateOnReplaceAll()
        })

        this.goUpButton.addEventListener('click', () => {
            const currentPosition = this.switchHandler.goUp()
            this.searchHandler.updateOnScrolling()
            this.searchHandler.updatePosition(currentPosition)
        })

        this.goDownButton.addEventListener('click', () => {
            const currentPosition = this.switchHandler.goDown()
            this.searchHandler.updateOnScrolling()
            this.searchHandler.updatePosition(currentPosition)
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