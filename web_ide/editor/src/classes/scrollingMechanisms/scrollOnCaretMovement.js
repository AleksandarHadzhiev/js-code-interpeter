import { BarVerticalHandler, BarHorizontalHandler } from "./BarHandler.js"
import ContentScrollingHandler from "./ContentScrollingHandler.js"
import LoaderHandler from "./LoaderHandler.js"
import LinesLoader from "./LinesLoader.js"

export default class ScrollOnCaretMovement {
    /**
     * @param { BarVerticalHandler } barVerticalHandler 
     * @param {LoaderHandler} loaderHandler 
     * @param {LinesLoader} linesLoader 
     * @param {ContentScrollingHandler} contentScrollingHandler
     * @param { BarHorizontalHandler } barHorizontalHandler 
     */
    constructor(loaderHandler, barVerticalHandler, linesLoader, contentScrollingHandler, barHorizontalHandler) {
        this.loaderHandler = loaderHandler
        this.barVerticalHandler = barVerticalHandler
        this.linesLoader = linesLoader
        this.contentScrollingHandler = contentScrollingHandler
        this.barHorizontalHandler = barHorizontalHandler
    }

    /**
     * 
     * @param {Number} newOffset 
     */
    updateTopOffset(newOffset) {
        this.loaderHandler.scrollWithOffset(newOffset)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barVerticalHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }

    updateLeftOffset(newOffset) {
        this.barHorizontalHandler.scrollWithOffset(newOffset)
        const percentage = this.barHorizontalHandler.getPercentageOfScroll()
        this.contentScrollingHandler.scrollWithPercentage(percentage)
    }
}