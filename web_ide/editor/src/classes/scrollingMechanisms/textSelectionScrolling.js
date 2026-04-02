import { BarVerticalHandler } from "./BarHandler.js";
import LoaderHandler from "./LoaderHandler.js";
import LinesLoader from "./LinesLoader.js";
import { MousePosition } from "../selectionMechanisms/enums.js";

export default class TextSelectionScrolling {
    /**
     * 
     * @param {BarVerticalHandler} barVerticalHandler 
     * @param {LoaderHandler} loaderHandler 
     * @param {LinesLoader} loaderHandler 
     */
    constructor(barVerticalHandler, loaderHandler, linesLoader) {
        this.barVerticalHandler = barVerticalHandler
        this.loaderHandler = loaderHandler
        this.linesLoader = linesLoader
    }

    /**
     * @param {String} mousePosition 
     */
    scrollOnMousePosition(mousePosition) {
        if (mousePosition == MousePosition.BOTTOM) {
            this._scrollDown()
        }
        else if (mousePosition == MousePosition.TOP) {
            this._scrollUp()
        }
        else {
            console.log("NOT SCROLLING")
        }
    }

    _scrollDown() {
        this.loaderHandler.scrollWithOffset(50)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barVerticalHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }

    _scrollUp() {
        this.loaderHandler.scrollWithOffset(-50)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barVerticalHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }
}