import { BarVerticalHandler } from "./BarHandler.js"
import LoaderHandler from "./LoaderHandler.js"
import LinesLoader from "./LinesLoader.js"

export default class ScrollOnCaretMovement {
    /**
     * @param { BarVerticalHandler } barVerticalHandler 
     * @param {LoaderHandler} loaderHandler 
     * @param {LinesLoader} linesLoader 
     */
    constructor(loaderHandler, barVerticalHandler, linesLoader) {
        this.loaderHandler = loaderHandler
        this.barVerticalHandler = barVerticalHandler
        this.linesLoader = linesLoader
    }

    /**
     * 
     * @param {Number} newOffset 
     */
    updateOffset(newOffset) {
        this.loaderHandler.scrollWithOffset(newOffset)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barVerticalHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }
}