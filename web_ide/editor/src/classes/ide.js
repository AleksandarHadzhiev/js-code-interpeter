import IntegratedDevelopmentEnvironmentSettings from "./ideSettings.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import Sidebar from "./sidebar.js";
import CodePanel from "./codePanel.js";

export default class IntegratedDevelopmentEnvironment {
    constructor() {
        this.menuElement = document.getElementById('menu')
        this.screen = document.getElementById('screen')
        this.contentElement = document.getElementById('content')
        this.screenWidth = this.screen.offsetWidth
        this.defaultSidebarPanelWidth = this.menuElement.offsetWidth
        this.resizeDraggerOberver = new ResizeDraggerObserver()
        this.sidebar = new Sidebar(this.menuElement, this.defaultSidebarPanelWidth, this.resizeDraggerOberver)
        this.codePanel = new CodePanel(this.contentElement, this.defaultSidebarPanelWidth, this.screenWidth, this.screen, this.resizeDraggerOberver)
    }
}
