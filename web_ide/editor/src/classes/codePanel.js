import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
import Editor from "./editor.js";
import ResizeDraggerObserver from "./resizeObserver.js";

export default class CodePanel {
    /**
     * 
     * @param {Number} menuWidth 
     * @param {Number} widthOfScreen 
     * @param {HTMLElement} screen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     */
    constructor(menuWidth, widthOfScreen, screen, resizeDraggerObserver) {
        this.codePanelResizer = new CodePanelResizer(menuWidth, widthOfScreen, screen)
        this.codeLoader = new CodeLoader(screen)
        this.editor = new Editor(menuWidth, widthOfScreen, resizeDraggerObserver)
        resizeDraggerObserver.addResizeListener(this.codePanelResizer)
    }
}