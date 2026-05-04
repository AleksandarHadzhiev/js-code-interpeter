import SidebarResizer from "./sidebarResizer.js"
import ResizeDragger from "./resizeDragger.js"
import ResizeDraggerObserver from "./resizeObserver.js"
import MenuOpener from "./menuOpener.js"
import ProjectLoader from "./projectLoader.js"
import FileLoader from "./fileLoader.js"
import ProjectLoaderObserver from "./projectLoaderObserver.js"
import FileLoaderObserver from "./fileLoaderObserver.js"

export default class Sidebar {
    /**
     * @param {FileLoaderObserver} fileLoaderObserver
     * @param {HTMLElement} menuElement
     * @param {Number} defaultSidebarPanelWidth
     * @param {ResizeDraggerObserver} resizeDraggerObserver
     */
    constructor(fileLoaderObserver, menuElement, defaultSidebarPanelWidth, resizeDraggerObserver) {
        this.menuElement = menuElement
        this.defaultSidebarPanelWidth = defaultSidebarPanelWidth
        this.minSidebarWidthForItToBeVisible = 150
        this.fileLoader = new FileLoader(fileLoaderObserver)
        this.projectLoaderObserver = new ProjectLoaderObserver(this.fileLoader)
        this.sidebarResizer = new SidebarResizer(defaultSidebarPanelWidth, this.minSidebarWidthForItToBeVisible)
        this.resizeDragger = new ResizeDragger(defaultSidebarPanelWidth, resizeDraggerObserver, this.minSidebarWidthForItToBeVisible)
        this.menuOpener = new MenuOpener(resizeDraggerObserver, this.minSidebarWidthForItToBeVisible)
        this.projectLoader = new ProjectLoader(this.projectLoaderObserver)
        resizeDraggerObserver.addResizeListener(this.sidebarResizer)
    }
}