import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
import Editor from "./editor.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import ScreenResizer from "./screenResizer.js";
import ScreenResizerObserver from "./screenResizerObserver.js";
import CodePanelScroller from "./codePanelScroller.js";
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js";
import FileLoader from "./fileLoader.js";

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
        this.screenResizerObserver = new ScreenResizerObserver()
        this.screenHeight = screen.offsetHeight
        this.screenResizer = new ScreenResizer(this.screenResizerObserver, screen)
        this.codePanelResizer = new CodePanelResizer(menuWidth, widthOfScreen, screen)
        this.codeLoader = new CodeLoader(screen, this.screenHeight, this.loaderElement)
        this.codePanelScroller = new CodePanelScroller(this.codeLoader, this.loaderElement, this.screenHeight)
        this.editor = new Editor(menuWidth, widthOfScreen, resizeDraggerObserver, screen, this.screenResizerObserver, this.screenHeight)
        resizeDraggerObserver.addResizeListener(this.codePanelResizer)
        this.screenResizerObserver.addScreenResizeListener(this.codeLoader)
        this.fileLoader = new FileLoader(this.codeLoader)
    }
}