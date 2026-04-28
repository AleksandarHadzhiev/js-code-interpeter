import CodePanelResizer from "./codePanelResizer.js";
import MousePositionDefiner from "./mousePositionDefiner.js";
import CodePanel from "./codePanel.js";
import ResizeDraggerObserver from "./resizeObserver.js";

export default class Editor { // is code panel part of editor or editor part of code panel??
    /**
     * 
     * @param {Number} defaultMenuWidth 
     * @param {Number} widthOfScreen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     */
    constructor(defaultMenuWidth, widthOfScreen, resizeDraggerObserver) {
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineNumerationWidth = this.lineNumerationElement.offsetWidth
        this.mousePositionDefiner = new MousePositionDefiner(this.lineNumerationWidth, defaultMenuWidth)
        resizeDraggerObserver.addResizeListener(this.mousePositionDefiner)
        window.addEventListener('mousemove', (event) => {
            const mousePosition = this.mousePositionDefiner.defineMousePosition(event)
            console.log(mousePosition)
        })
    }
}