import CodeLoader from "./codeLoader.js"
import OffsetCalculator from "./scrollingMechanisms/OffsetCalculator.js"
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js"
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js"
import VerticalScroller from "./verticalScroller.js"
import HorizontalScroller from "./horizontalScroller.js"

export default class CodePanelScroller {
    /**
     * 
     * @param {CodeLoader} codeLoader 
     * @param {HTMLElement} loaderElement
     * @param {Number} screenHeight 
     * @param {LoaderElementResizeObserver} loaderElementResizeObserver 
     * @param {Number} screenWidth 
     * @param {Number} lineContentWidth
     * @param {Number} leftOffset
     * @param {Number} lineNumerationWidth
     * @param {HTMLElement} lineContentElement    
     */
    constructor(
        codeLoader, loaderElement,
        screenHeight, loaderElementResizeObserver,
        screenWidth, lineContentWidth, leftOffset,
        lineNumerationWidth, lineContentElement) {
        this.offsetCalculator = new OffsetCalculator()
        this.height = screenHeight
        this.codeLoader = codeLoader
        this.verticalScroller = new VerticalScroller(this.height, this.codeLoader, loaderElement, screenWidth)
        this.barVerticalWidth = this.verticalScroller.barElement.offsetWidth
        this.horizontalScroller = new HorizontalScroller(
            screenHeight, screenWidth, lineContentWidth,
            leftOffset, lineNumerationWidth,
            lineContentElement, codeLoader, this.barVerticalWidth
        )
        loaderElementResizeObserver.addListener(this.verticalScroller.loaderHandler)
        window.addEventListener('wheel', (event) => {
            if (event.deltaY != -0)
                this._scrollVertical(event)
            else this._scrollHorizontal(event)
        })
    }

    updateProportions(newWidth) {
        this.horizontalScroller.updateProportions(newWidth)
    }

    updateScreenSizes(newWidth, newHeight) {
        this.verticalScroller.updateProportions(newHeight, newWidth)
        this.horizontalScroller.updateProportionsOnResize(newWidth)
    }

    /**
     * @param {WheelEvent} event 
     */
    _scrollVertical(event) {
        const offset = this.offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
        this.verticalScroller.scrollWithOffset(offset)
    }

    /**
     * @param {WheelEvent} event 
     */
    _scrollHorizontal(event) {
        this.horizontalScroller.scroll(event.deltaX)
    }
}