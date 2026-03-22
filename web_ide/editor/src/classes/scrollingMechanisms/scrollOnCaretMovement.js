import BarHandler from "./BarHandler.js"
import LoaderHandler from "./LoaderHandler.js"
import LinesLoader from "./LinesLoader.js"

export default class ScrollOnCaretMovement {
    /**
     * @param {BarHandler} barHandler 
     * @param {LoaderHandler} loaderHandler 
     * @param {LinesLoader} linesLoader 
     */
    constructor(loaderHandler, barHandler, linesLoader) {
        this.loaderHandler = loaderHandler
        this.barHandler = barHandler
        this.linesLoader = linesLoader
    }

    /**
     * 
     * @param {Number} newOffset 
     */
    updateOffset(newOffset) {
        this.loaderHandler.scrollWithOffset(newOffset)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        console.log(this.loaderHandler.topOffset)
        this.barHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }
}