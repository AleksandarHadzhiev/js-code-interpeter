import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
import Editor from "./editor.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import ScreenResizer from "./screenResizer.js";
import ScreenResizerObserver from "./screenResizerObserver.js";
import CodePanelScroller from "./codePanelScroller.js";
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js";
import ProjectLoader from "./projectLoader.js";
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js";
import LoaderElementResizer from "./loaderElementResizer.js";
import LineContentElementResizer from "./lineContentElementResizer.js";
import LineContentElementResizeObseever from "./lineContentElementResizeObserver.js";

export default class CodePanel {
    /**
     * @param {Number} menuWidth 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     * @param {ScreenResizerObserver} screenResizerObserver
     */
    constructor(menuWidth, resizeDraggerObserver, screenResizerObserver) {
        this.screen = document.getElementById('screen')
        this.contentElement = document.getElementById('content')
        this.screenWidth = this.screen.offsetWidth
        this.loaderElement = document.getElementById('loader')
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.lineContentResizer = new LineContentElementResizer(this.lineContentElement)
        this.lineContentResizeObserver = new LineContentElementResizeObseever()
        this.lineContentWidth = this.lineContentElement.offsetWidth
        this.lineNumerationWidth = this.lineNumerationElement.offsetWidth
        this.screenHeight = this.screen.offsetHeight
        this.loaderElementResizeObserver = new LoaderElementResizeObserver()
        this.loaderElementResizer = new LoaderElementResizer(this.loaderElement)
        this.codeLoader = new CodeLoader(this.screen, this.screenHeight,
            this.loaderElementResizeObserver, this.lineNumerationElement,
            this.lineContentElement, this.lineContentResizeObserver)
        this.codePanelScroller = new CodePanelScroller(
            menuWidth, this.codeLoader, this.loaderElement, this.screenHeight,
            this.loaderElementResizeObserver, this.screenWidth, this.lineContentWidth,
            this.lineNumerationWidth, this.lineContentElement)
        this.editor = new Editor(
            this.contentElement, menuWidth, this.screenWidth, resizeDraggerObserver,
            screen, this.screenResizerObserver, this.screenHeight,
            this.codeLoader.linesLoader, this.lineContentElement, this.lineNumerationWidth)
        this.projectLoader = new ProjectLoader(this.codeLoader, this.loaderElementResizeObserver)
        this.loaderElementResizeObserver.addListener(this.loaderElementResizer)
        this.loaderElementResizeObserver.addListener(this.codeLoader)
        screenResizerObserver.addScreenResizeListener(this.codeLoader)
        screenResizerObserver.addScreenResizeListener(this.codePanelScroller)
        resizeDraggerObserver.addResizeListener(this.codePanelScroller)
        this.lineContentResizeObserver.addListener(this.lineContentResizer)
        this.lineContentResizeObserver.addListener(this.codePanelScroller.horizontalScroller)
    }
}