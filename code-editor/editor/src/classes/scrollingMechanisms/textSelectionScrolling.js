import BarHandler from "./BarHandler.js";
import LoaderHandler from "./LoaderHandler.js";
import LinesLoader from "./LinesLoader.js";
import { MousePosition } from "../selectionMechanisms/enums.js";

export default class TextSelectionScrolling {
    /**
     * 
     * @param {BarHandler} barHandler 
     * @param {LoaderHandler} loaderHandler 
     * @param {LinesLoader} loaderHandler 
     */
    constructor(barHandler, loaderHandler, linesLoader) {
        this.barHandler = barHandler
        this.loaderHandler = loaderHandler
        this.linesLoader = linesLoader
    }

    /**
     * @param {String} mousePosition 
     */
    scrollOnMousePosition(mousePosition) {
        console.log(mousePosition)
        if (mousePosition == MousePosition.BOTTOM) {
            this._scrollDown()
        }
        else if (mousePosition == MousePosition.TOP) {
            this._scrollUp()
        }
    }

    _scrollDown() {
        this.loaderHandler.scrollWithOffset(50)
        console.log(this.loaderHandler.topOffset)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }

    _scrollUp() {
        this.loaderHandler.scrollWithOffset(-50)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barHandler.scrollBasedOnPercentage(percentage)
        this.linesLoader.reloadLinesForNewTopOffset(this.loaderHandler.topOffset)
    }
}