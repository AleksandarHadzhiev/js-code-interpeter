import ResizeDraggerObserver from "./resizeObserver.js";
import ScreenResizerObserver from "./screenResizerObserver.js";
import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import TextHighlighter from "./textHighlighter.js";

export default class Editor {
    /**
     * 
     * @param {Number} defaultMenuWidth 
     * @param {Number} widthOfScreen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     * @param {HTMLElement} screen 
     * @param {ScreenResizerObserver} screenResizerObserver
     * @param {Number} screenHeight 
     * @param {LinesLoader} linesLoader 
     */
    constructor(defaultMenuWidth, widthOfScreen, resizeDraggerObserver, screen, screenResizerObserver, screenHeight, linesLoader) {
        this.lineContentElement = document.getElementById('line-content')
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.contentElement = document.getElementById('content')
        this.offsetTop = document.getElementById('navigation').offsetHeight
        this.lineNumerationWidth = this.lineNumerationElement.offsetWidth
        this.textHighlighter = new TextHighlighter(linesLoader, this.offsetTop, this.contentElement, this.lineNumerationWidth, defaultMenuWidth, screen, screenHeight, resizeDraggerObserver, screenResizerObserver)
        this.isSelectingText = false

        this.lineContentElement.addEventListener('mousedown', (event) => {
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