import CodePanelResizer from "./codePanelResizer.js";
import SidebarResizer from "./sidebarResizer.js";

export default class IntegratedDevelopmentEnvironment {
    /**
     * 
     * @param {SidebarResizer} sidebarResizer 
     * @param {CodePanelResizer} codePanelResizer
     */
    constructor(sidebarResizer, codePanelResizer) {
        this.sidebarResizer = sidebarResizer
        this.codePanelResizer = codePanelResizer
    }
}
