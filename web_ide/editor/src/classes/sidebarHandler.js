export default class SidebarHandler {
    constructor() {
        this.mainContainer = document.getElementById('container')
        this.menuContainer = document.getElementById('menu')
        this.screen = document.getElementById('screen')
        this.sidebar = document.getElementById('sidebar')
        this.resizeDragger = document.getElementById('resize-dragger')
        this.navigationElement = document.getElementById('navigation')
        this.defaultLeftOffsetForContent = this.menuContainer.offsetWidth
        this.totalWidthOfScreen = this.screen.offsetWidth
        this.leftOffsetForContent = this.defaultLeftOffsetForContent
        this.defaultWidthForContent = this.totalWidthOfScreen - this.defaultLeftOffsetForContent
        this.widthForContent = this.defaultWidthForContent
        this.contentOffsetTop = this.navigationElement.offsetHeight
        this.editorHeight = this.mainContainer.offsetHeight - this.contentOffsetTop
        this.sidebar.addEventListener('visibilityChanged', () => {
            this._updateWithWidth(this.sidebar.offsetWidth)
        })
        this.isResizing = false
        this.resizeDragger.addEventListener('mousedown', () => {
            this.isResizing = true
        })
        window.addEventListener('mousemove', (event) => {
            if (this.isResizing) {
                const width = event.pageX - this.defaultLeftOffsetForContent
                if (width < 150)
                    this.sidebar.className = 'hidden'
                else {
                    this.sidebar.className = 'sidebar'
                    this.sidebar.style = `width: ${width}px;`
                }
                console.log(width)
                this._updateWithWidth(width)
            }
        })

        window.addEventListener('mouseup', () => {
            this.isResizing = false
        })

        window.addEventListener('resize', (event) => {
            this.editorHeight = this.mainContainer.offsetHeight - this.contentOffsetTop
            if (this.screen.offsetWidth - this.leftOffsetForContent > 250) {
                const totalWidth = this.totalWidthOfScreen
                const percentage = (this.leftOffsetForContent / totalWidth) * 100
                this.totalWidthOfScreen = this.screen.offsetWidth
                const offset = this.totalWidthOfScreen * (percentage / 100)
                this.widthForContent = this.totalWidthOfScreen - offset
            }
        })
    }

    _updateWithWidth(width) {
        if (this.sidebar.className == "hidden") {
            this.leftOffsetForContent = this.defaultLeftOffsetForContent
            this.widthForContent = this.screen.offsetWidth - this.defaultLeftOffsetForContent
        }
        else {
            this.leftOffsetForContent = width + this.defaultLeftOffsetForContent
            this.widthForContent = this.screen.offsetWidth - this.leftOffsetForContent
        }
    }
}