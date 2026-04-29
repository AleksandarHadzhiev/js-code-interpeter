import CodeLoader from "./codeLoader.js"
import OffsetCalculator from "./scrollingMechanisms/OffsetCalculator.js"
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js"
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js"

export default class CodePanelScroller {
    /**
     * 
     * @param {CodeLoader} codeLoader 
     * @param {HTMLElement} loaderElement
     * @param {Number} screenHeight 
     * @param {LoaderElementResizeObserver} loaderElementResizeObserver 
     */
    constructor(codeLoader, loaderElement, screenHeight, loaderElementResizeObserver) {
        this.offsetCalculator = new OffsetCalculator()
        this.height = screenHeight
        this.codeLoader = codeLoader
        this.loaderHandler = new LoaderHandler(this.codeLoader.height, this.height, loaderElement)
        this.horizontalScroller = null
        this.verticalScroller = null
        loaderElementResizeObserver.addListener(this.loaderHandler)
        window.addEventListener('wheel', (event) => {
            if (event.deltaY != -0)
                this._scrollVertical(event)
            else this._scrollHorizontal(event)
        })
    }



    /**
     * @param {WheelEvent} event 
     */
    _scrollVertical(event) {
        const offset = this.offsetCalculator.calculateOffsetBasedOnDeltaYOfMouseEvent(event.deltaY)
        this.loaderHandler.scrollWithOffset(offset)
        this.codeLoader.updateVisibleLinesOnVerticalScrolling(this.loaderHandler.topOffset)
    }

    /**
     * @param {WheelEvent} event 
     */
    _scrollHorizontal(event) {
        console.log(event)
    }
}