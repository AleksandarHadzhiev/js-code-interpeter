import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
export default class CodePanel {
    /**
     * 
     * @param {HTMLElement} menu 
     * @param {Number} menuWidth 
     * @param {Number} widthOfScreen 
     */
    constructor(menu, menuWidth, widthOfScreen) {
        this.codePanelResizer = new CodePanelResizer(menu, menuWidth, widthOfScreen)
        this.codeLoader = new CodeLoader()
        // for now two certain parts of the code panel are the code loader and the code panel resizer
    }
}