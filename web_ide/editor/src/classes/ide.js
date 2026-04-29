import IntegratedDevelopmentEnvironmentSettings from "./ideSettings.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import Sidebar from "./sidebar.js";
import CodePanel from "./codePanel.js";

export default class IntegratedDevelopmentEnvironment {
    constructor() {
        this.menuElement = document.getElementById('menu')
        this.screen = document.getElementById('screen')
        this.screenWidth = this.screen.offsetWidth
        this.defaultSidebarPanelWidth = this.menuElement.offsetWidth
        this.resizeDraggerOberver = new ResizeDraggerObserver()
        this.sidebar = new Sidebar(this.menuElement, this.defaultSidebarPanelWidth, this.resizeDraggerOberver)
        this.codePanel = new CodePanel(this.defaultSidebarPanelWidth, this.screenWidth, this.screen, this.resizeDraggerOberver)
    }
}

/**
 * What should be the structure of the IDE?
 *  - when user has logged in, it should fetch his preferred settings add attach
 *    them to the IDE.
 *  - the screen is split into two panels:
 *    - sidebar panel
 *    - code panel - look for a better name (interpeter panel?)
 *  - the sidebar panel has a resizing functionality, which requires updates in sizes for both
 *    the sidebar and the code panel
 *  - also via the explorer (page inside the sidebar) the user loads projects and opens files.
 *  - when a file is opened, its content is provided to the code panel
 */ // so is the editor first or is the panel first??