import ResizeDraggerObserver from "./resizeObserver.js"
export default class MenuOpener {
    /**
     * @param {ResizeDraggerObserver} resizeDraggerObserver
     * @param {Number} minRequiredSidebarWidthForVisibility
     */
    constructor(resizeDraggerObserver, minRequiredSidebarWidthForVisibility) {
        this.sidebar = document.getElementById('sidebar')
        this.explorer = document.getElementById('explorer')
        this.explorer.addEventListener('click', (event) => {
            const className = this.sidebar.className
            if (className == 'hidden') this.sidebar.className = 'sidebar'
            else this.sidebar.className = 'hidden'
            const width = this.sidebar.offsetWidth
            resizeDraggerObserver.notifyResizeListeners(width)
        })
    }
}