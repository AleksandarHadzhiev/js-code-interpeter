import { BarVerticalHandler } from "./scrollingMechanisms/BarHandler.js"
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js"
import CodeLoader from "./codeLoader.js"

export default class VerticalScroller {
    /**
     * 
     * @param {Number} screenHeight 
     * @param {CodeLoader} codeLoader 
     * @param {HTMLElement} loaderElement 
     * @param {Number} screenWidth 
     */
    constructor(screenHeight, codeLoader, loaderElement, screenWidth) {
        this.scrollbarAreaElementVertical = document.getElementById('scrollable-area-vertical')
        this.widthOfAllowedAreaForScrolling = this.scrollbarAreaElementVertical.offsetWidth
        this.barElement = document.getElementById('bar-vertical')
        this.barHeight = this.barElement.offsetHeight
        this.codeLoader = codeLoader
        this.screenWidth = screenWidth
        this.isScrolling = false

        this.barVerticalHandler = new BarVerticalHandler(
            screenHeight, this.barHeight, this.barElement
        )

        this.loaderHandler = new LoaderHandler(
            codeLoader.height, screenHeight, loaderElement
        )

        this.barElement.addEventListener('mousedown', () => {
            this.isScrolling = true
            this.scrollbarAreaElementVertical.style.pointerEvents = "all"
        })

        window.addEventListener('mousemove', (event) => {
            if (this.isScrolling) {
                const pixelsOutOfScreenBorder = event.clientX - this.screenWidth
                const isAllowedOutsideOFScreen = pixelsOutOfScreenBorder < this.widthOfAllowedAreaForScrolling && pixelsOutOfScreenBorder >= 0
                const isAllowedInsideOfScreen = pixelsOutOfScreenBorder > this.widthOfAllowedAreaForScrolling * -1 && pixelsOutOfScreenBorder < 0
                if (isAllowedOutsideOFScreen)
                    this._scrollOnBarMovement(event)
                else if (isAllowedInsideOfScreen)
                    this._scrollOnBarMovement(event)
            }
        })

        window.addEventListener('mouseup', () => {
            this.isScrolling = false
            this.scrollbarAreaElementVertical.style.pointerEvents = "none"
        })
    }

    updateProportions(newHeight, newWidth) {
        this.barVerticalHandler.updateHeight(newHeight)
        this.screenWidth = newWidth
        this.scrollbarAreaElementVertical.style = `height: ${newHeight}px`;
    }

    updateProportionsOnResize(newHeight) {
        console.log(newHeight)
        console.log(this.loaderHandler.height)
        this.barVerticalHandler.barHeight = this.barElement.offsetHeight
        this.barVerticalHandler.updateHeight(newHeight)
        this.scrollbarAreaElementVertical.style = `height: ${newHeight}px`;
        this.loaderHandler.updateHeights(this.loaderHandler.height, newHeight)
    }

    /**
     * 
     * @param {Number} offset 
     */
    scrollWithOffset(offset) {
        this.loaderHandler.scrollWithOffset(offset)
        const percentage = this.loaderHandler.getPercentageOfScroll()
        this.barVerticalHandler.scrollBasedOnPercentage(percentage)
        this.codeLoader.updateVisibleLinesOnVerticalScrolling(this.loaderHandler.topOffset)
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    _scrollOnBarMovement(event) {
        const offset = event.clientY - 35
        this.barVerticalHandler.scrollWithOffset(offset)
        const percentage = this.barVerticalHandler.getPercentageOfScroll()
        this.loaderHandler.scrollWithPercentage(percentage)
        this.codeLoader.updateVisibleLinesOnVerticalScrolling(this.loaderHandler.topOffset)
    }
}