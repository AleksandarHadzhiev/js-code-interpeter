import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
import Editor from "./editor.js";

export default class CodePanel {
    /**
     * 
     * @param {Number} menuWidth 
     * @param {Number} widthOfScreen 
     * @param {HTMLElement} screen 
     * @param {ResizeObserver} resizeOberver 
     */
    constructor(menuWidth, widthOfScreen, screen, resizeOberver) {
        this.codePanelResizer = new CodePanelResizer(menuWidth, widthOfScreen, screen)
        this.codeLoader = new CodeLoader(screen)
        this.editor = new Editor(menuWidth, widthOfScreen, resizeOberver)
        resizeOberver.addResizeListener(this.codePanelResizer)
    }
}