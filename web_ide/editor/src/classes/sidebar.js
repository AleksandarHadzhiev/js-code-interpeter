import SidebarResizer from "./sidebarResizer.js"
import ResizeDragger from "./resizeDragger.js"
import ResizeObserver from "./resizeObserver.js"
import MenuOpener from "./menuOpener.js"

export default class Sidebar {
    /**
     * 
     * @param {HTMLElement} menuElement
     * @param {Number} defaultSidebarPanelWidth
     * @param {ResizeObserver} resizeObserver
     */
    constructor(menuElement, defaultSidebarPanelWidth, resizeObserver) {
        this.menuElement = menuElement
        this.defaultSidebarPanelWidth = defaultSidebarPanelWidth
        this.minSidebarWidthForItToBeVisible = 150
        this.sidebarResizer = new SidebarResizer(defaultSidebarPanelWidth, this.minSidebarWidthForItToBeVisible)
        this.resizeDragger = new ResizeDragger(defaultSidebarPanelWidth, resizeObserver, this.minSidebarWidthForItToBeVisible)
        this.menuOpener = new MenuOpener(resizeObserver, this.minSidebarWidthForItToBeVisible)
        resizeObserver.addResizeListener(this.sidebarResizer)
    }
}