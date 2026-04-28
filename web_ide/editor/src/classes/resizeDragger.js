import ResizeDraggerObserver from "./resizeObserver.js"

export default class ResizeDragger {
    /**
     * 
     * @param {Number} defaultWidthForMenuScreen 
     * @param {ResizeDraggerObserver} resizeDraggerObserver 
     * @param {Number} minRequiredSidebarWidthForVisibility 
     */
    constructor(defaultWidthForMenuScreen, resizeDraggerObserver, minRequiredSidebarWidthForVisibility) {
        this.resizeDraggerObserver = resizeDraggerObserver
        this.sidebar = document.getElementById('sidebar')
        this.resizeDragger = document.getElementById('resize-dragger')
        this.defaultWidthForMenuScreen = defaultWidthForMenuScreen
        this.widthForMenuScreen = defaultWidthForMenuScreen
        this.isResizing = false

        this.resizeDragger.addEventListener('mousedown', () => { this.isResizing = true })
        window.addEventListener('mousemove', (event) => {
            if (this.isResizing) {
                let width = event.pageX - this.defaultWidthForMenuScreen
                if (width < minRequiredSidebarWidthForVisibility)
                    width = 0
                this.resizeDraggerObserver.notifyResizeListeners(width)
            }
        })
        window.addEventListener('mouseup', () => {
            this.isResizing = false
        })
    }
}
