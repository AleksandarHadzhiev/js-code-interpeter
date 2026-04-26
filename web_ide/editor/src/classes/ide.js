import CodePanelResizer from "./codePanelResizer.js";
import SidebarResizer from "./sidebarResizer.js";
import Editor from "./editor.js";

export default class IntegratedDevelopmentEnvironment {
    /**
     * 
     * @param {SidebarResizer} sidebarResizer 
     * @param {Editor} editor
     */
    constructor(sidebarResizer, editor) {
        this.sidebarResizer = sidebarResizer
        this.codePanelResizer = editor
    }
}
