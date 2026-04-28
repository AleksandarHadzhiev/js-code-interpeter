import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
import Editor from "./editor.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import ScreenResizer from "./screenResizer.js";
import ScreenResizerObserver from "./screenResizerObserver.js";

export default class CodePanel {
    /**
     * 
     * @param {Number} menuWidth 
     * @param {Number} widthOfScreen 
     * @param {HTMLElement} screen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     */
    constructor(menuWidth, widthOfScreen, screen, resizeDraggerObserver) {
        this.screenResizerObserver = new ScreenResizerObserver()
        this.screenResizer = new ScreenResizer(this.screenResizerObserver, screen)
        this.codePanelResizer = new CodePanelResizer(menuWidth, widthOfScreen, screen)
        this.codeLoader = new CodeLoader(screen)
        this.editor = new Editor(menuWidth, widthOfScreen, resizeDraggerObserver, screen, this.screenResizerObserver)
        resizeDraggerObserver.addResizeListener(this.codePanelResizer)
    }
}