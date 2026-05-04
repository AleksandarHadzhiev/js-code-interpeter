import ResizeDraggerObserver from "./resizeObserver.js";
import ScreenResizerObserver from "./screenResizerObserver.js";
import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import TextHighlighter from "./textHighlighter.js";
import LineContentElementResizer from "./lineContentElementResizer.js";
import LineContentElementResizeObseever from "./lineContentElementResizeObserver.js";

export default class Editor {
    /**
     * @param {HTMLElement} contentElement
     * @param {Number} defaultMenuWidth 
     * @param {Number} widthOfScreen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     * @param {HTMLElement} screen 
     * @param {ScreenResizerObserver} screenResizerObserver
     * @param {Number} screenHeight 
     * @param {LinesLoader} linesLoader 
     * @param {HTMLElement} lineContentElement
     * @param {Number} lineNumerationWidth 
     */
    constructor(contentElement, defaultMenuWidth, widthOfScreen, resizeDraggerObserver, screen, screenResizerObserver, screenHeight, linesLoader, lineContentElement, lineNumerationWidth) {
        this.offsetTop = document.getElementById('navigation').offsetHeight
        this.textHighlighter = new TextHighlighter(
            linesLoader,
            this.offsetTop,
            contentElement,
            lineNumerationWidth,
            defaultMenuWidth,
            screen,
            screenHeight,
            resizeDraggerObserver,
            screenResizerObserver)
        this.isSelectingText = false
        lineContentElement.addEventListener('mousedown', (event) => {
            this.isSelectingText = true
        })

        window.addEventListener('mousemove', (event) => {
            if (this.isSelectingText) {
                this.textHighlighter.highlightText(event)
            }
        })

        window.addEventListener('mouseup', (event) => {
            this.isSelectingText = false
            this.textHighlighter.cleanRanges()
        })
    }
}