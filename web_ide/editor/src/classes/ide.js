import CodePanelHandler from "./codePanelHandler.js";
import SidebarHandler from "./sidebarHandler.js";

export default class IntegratedDevelopmentEnvironment {
    /**
     * 
     * @param {SidebarHandler} sidebarHandler 
     * @param {CodePanelHandler} codePanelHandler 
     */
    constructor(sidebarHandler, codePanelHandler) {
        this.sidebarHandler = sidebarHandler
        this.codePanelHandler = codePanelHandler
    }
}