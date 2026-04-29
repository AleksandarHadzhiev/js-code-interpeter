import SidebarResizer from "./sidebarResizer.js"
import ResizeDragger from "./resizeDragger.js"
import ResizeDraggerObserver from "./resizeObserver.js"
import MenuOpener from "./menuOpener.js"
import ProjectLoader from "./projectLoader.js"

export default class Sidebar {
    /**
     * 
     * @param {HTMLElement} menuElement
     * @param {Number} defaultSidebarPanelWidth
     * @param {ResizeDraggerObserver} resizeDraggerObserver
     * @param {ProjectLoader} projectLoader 
     */
    constructor(menuElement, defaultSidebarPanelWidth, resizeDraggerObserver, projectLoader) {
        this.menuElement = menuElement
        this.defaultSidebarPanelWidth = defaultSidebarPanelWidth
        this.minSidebarWidthForItToBeVisible = 150
        this.sidebarResizer = new SidebarResizer(defaultSidebarPanelWidth, this.minSidebarWidthForItToBeVisible)
        this.resizeDragger = new ResizeDragger(defaultSidebarPanelWidth, resizeDraggerObserver, this.minSidebarWidthForItToBeVisible)
        this.menuOpener = new MenuOpener(resizeDraggerObserver, this.minSidebarWidthForItToBeVisible)
        resizeDraggerObserver.addResizeListener(this.sidebarResizer)
    }
}