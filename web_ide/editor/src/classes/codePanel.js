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
     * 
     * @param {Number} menuWidth 
     * @param {Number} widthOfScreen 
     * @param {HTMLElement} screen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     */
    constructor(menuWidth, widthOfScreen, screen, resizeDraggerObserver) {
        this.loaderElement = document.getElementById('loader')
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.lineContentResizer = new LineContentElementResizer(this.lineContentElement)
        this.lineContentResizeObserver = new LineContentElementResizeObseever()
        this.lineContentWidth = this.lineContentElement.offsetWidth
        this.lineNumerationWidth = this.lineNumerationElement.offsetWidth
        this.screenHeight = screen.offsetHeight
        this.defaultLeftOffset = menuWidth + this.lineNumerationWidth
        this.loaderElementResizeObserver = new LoaderElementResizeObserver()
        this.screenResizerObserver = new ScreenResizerObserver()
        this.loaderElementResizer = new LoaderElementResizer(this.loaderElement)
        this.screenResizer = new ScreenResizer(this.screenResizerObserver, screen)
        this.codePanelResizer = new CodePanelResizer(menuWidth, widthOfScreen, screen)
        this.codeLoader = new CodeLoader(screen, this.screenHeight, this.loaderElementResizeObserver, this.lineNumerationElement, this.lineContentElement, this.lineContentResizeObserver)
        this.codePanelScroller = new CodePanelScroller(
            this.codeLoader, this.loaderElement,
            this.screenHeight, this.loaderElementResizeObserver,
            widthOfScreen, this.lineContentWidth, menuWidth, this.lineNumerationWidth, this.lineContentElement)
        this.editor = new Editor(
            menuWidth, widthOfScreen,
            resizeDraggerObserver, screen,
            this.screenResizerObserver, this.screenHeight,
            this.codeLoader.linesLoader, this.lineContentElement, this.lineNumerationWidth)
        this.projectLoader = new ProjectLoader(this.codeLoader, this.loaderElementResizeObserver)
        this.loaderElementResizeObserver.addListener(this.loaderElementResizer)
        this.loaderElementResizeObserver.addListener(this.codeLoader)
        resizeDraggerObserver.addResizeListener(this.codePanelResizer)
        this.screenResizerObserver.addScreenResizeListener(this.codeLoader)
        this.screenResizerObserver.addScreenResizeListener(this.codePanelResizer)
        this.screenResizerObserver.addScreenResizeListener(this.codePanelScroller)
        resizeDraggerObserver.addResizeListener(this.codePanelScroller)
        this.lineContentResizeObserver.addListener(this.lineContentResizer)
        this.lineContentResizeObserver.addListener(this.codePanelScroller.horizontalScroller)
    }
}