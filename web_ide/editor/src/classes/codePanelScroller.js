import CodeLoader from "./codeLoader.js"
import OffsetCalculator from "./scrollingMechanisms/OffsetCalculator.js"
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js"
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js"
import VerticalScroller from "./verticalScroller.js"

export default class CodePanelScroller {
    /**
     * 
     * @param {CodeLoader} codeLoader 
     * @param {HTMLElement} loaderElement
     * @param {Number} screenHeight 
     * @param {LoaderElementResizeObserver} loaderElementResizeObserver 
     * @param {Number} screenWidth 
     */
    constructor(codeLoader, loaderElement, screenHeight, loaderElementResizeObserver, screenWidth) {
        this.offsetCalculator = new OffsetCalculator()
        this.height = screenHeight
        this.codeLoader = codeLoader
        this.horizontalScroller = null
        this.verticalScroller = new VerticalScroller(this.height, this.codeLoader, loaderElement, screenWidth)
        loaderElementResizeObserver.addListener(this.verticalScroller.loaderHandler)
        window.addEventListener('wheel', (event) => {
            if (event.deltaY != -0)
                this._scrollVertical(event)
            else this._scrollHorizontal(event)
        })
    }

    updateScreenSizes(newWidth, newHeight) {
        this.verticalScroller.updateProportions(newHeight, newWidth)
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
        console.log(event)
    }
}