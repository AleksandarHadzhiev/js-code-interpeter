import ResizeObserver from "./resizeObserver.js"
export default class MenuOpener {
    /**
     * @param {ResizeObserver} resizeObserver
     * @param {Number} minRequiredSidebarWidthForVisibility
     */
    constructor(resizeObserver, minRequiredSidebarWidthForVisibility) {
        this.sidebar = document.getElementById('sidebar')
        this.explorer = document.getElementById('explorer')
        this.explorer.addEventListener('click', (event) => {
            const className = this.sidebar.className
            if (className == 'hidden') this.sidebar.className = 'sidebar'
            else this.sidebar.className = 'hidden'
            const width = this.sidebar.offsetWidth
            resizeObserver.notifyResizeListeners(width)
        })
    }
}