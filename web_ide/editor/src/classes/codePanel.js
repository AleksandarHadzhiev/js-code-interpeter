import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
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
        resizeOberver.addResizeListener(this.codePanelResizer)
    }
}