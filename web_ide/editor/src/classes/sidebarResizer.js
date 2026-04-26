export default class SidebarResizer {
    constructor() {
        this.menuContainer = document.getElementById('menu')
        this.sidebar = document.getElementById('sidebar')
        this.resizeDragger = document.getElementById('resize-dragger')
        this.defaultWidthForMenuScreen = this.menuContainer.offsetWidth
        this.widthForMenuScreen = this.defaultWidthForMenuScreen
        this.isResizing = false
        this.sidebar.addEventListener('visibilityChanged', () => { this._updateWithWidth(this.sidebar.offsetWidth) })
        this.resizeDragger.addEventListener('mousedown', () => { this.isResizing = true })
        window.addEventListener('mousemove', (event) => {
            if (this.isResizing) {
                const width = event.pageX - this.defaultWidthForMenuScreen
                if (width < 150)
                    this.sidebar.className = 'hidden'
                else {
                    this.sidebar.className = 'sidebar'
                    this.sidebar.style = `width: ${width}px;`
                }
                this._updateWithWidth(width)
            }
        })
        window.addEventListener('mouseup', () => { this.isResizing = false })
    }

    _updateWithWidth(width) {
        if (this.sidebar.className == "hidden") { this.widthForMenuScreen = this.defaultWidthForMenuScreen }
        else { this.widthForMenuScreen = width + this.defaultWidthForMenuScreen }
        this.menuContainer.dispatchEvent(new CustomEvent('resized', { 'detail': { 'sidebarWidth': this.widthForMenuScreen } }))
    }
}