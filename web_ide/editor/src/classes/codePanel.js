import CodePanelResizer from "./codePanelResizer.js";
import CodeLoader from "./codeLoader.js";
export default class CodePanel {
    /**
     * 
     * @param {HTMLElement} menu 
     * @param {Number} menuWidth 
     * @param {Number} widthOfScreen 
     */
    constructor(menu, menuWidth, widthOfScreen, screen) {
        this.screen = document.getElementById('screen')
        this.codePanelResizer = new CodePanelResizer(menu, menuWidth, widthOfScreen, screen)
        this.codeLoader = new CodeLoader(this.screen)
        // for now two certain parts of the code panel are the code loader and the code panel resizer
    }
}