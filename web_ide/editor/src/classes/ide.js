import IntegratedDevelopmentEnvironmentSettings from "./ideSettings.js";
import ResizeDraggerObserver from "./resizeObserver.js";
import Sidebar from "./sidebar.js";
import CodePanel from "./codePanel.js";
import FileLoader from "./fileLoader.js";
import CodePanelResizer from "./codePanelResizer.js";
import ScreenResizerObserver from "./screenResizerObserver.js";
import ScreenResizer from "./screenResizer.js";
import FileLoaderObserver from "./fileLoaderObserver.js";

export default class IntegratedDevelopmentEnvironment {
    constructor() {
        this.menuElement = document.getElementById('menu')
        this.screen = document.getElementById('screen')
        this.contentElement = document.getElementById('content')
        this.screenWidth = this.screen.offsetWidth
        this.defaultSidebarPanelWidth = this.menuElement.offsetWidth
        this.resizeDraggerOberver = new ResizeDraggerObserver()
        this.screenResizerObserver = new ScreenResizerObserver()
        this.codePanel = new CodePanel(this.defaultSidebarPanelWidth, this.resizeDraggerOberver, this.screenResizerObserver)
        this.fileLoaderObserver = new FileLoaderObserver(this.codePanel)
        this.sidebar = new Sidebar(this.fileLoaderObserver, this.menuElement, this.defaultSidebarPanelWidth, this.resizeDraggerOberver)
    }
}
