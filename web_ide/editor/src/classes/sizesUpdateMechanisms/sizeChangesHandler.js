export default class SizeChangesHandler {
    constructor() {
        this.listeners = []
        this.mainContainer = document.getElementById('container')
        this.screen = document.getElementById('screen')
        this.sidebar = document.getElementById('sidebar')
        this.contentElement = document.getElementById('content')
        this.resizeDragger = document.getElementById('resize-dragger')
        this.navigationElement = document.getElementById('navigation')
        this.loaderElement = document.getElementById('loader')
        this.defaultLeftOffsetForContent = 0
        this.leftOffsetForContent = this.defaultLeftOffsetForContent
        this.defaultWidthForContent = this.screen.offsetWidth - this.defaultLeftOffsetForContent
        this.widthForContent = this.defaultWidthForContent
        this.totalWidthOfScreen = this.mainContainer.offsetWidth
        this.contentOffsetTop = this.navigationElement.offsetHeight
        this.editorHeight = this.mainContainer.offsetHeight - this.contentOffsetTop
        this.sidebar.addEventListener('visibilityChanged', () => {
            console.log('here')
            this._updateWithWidth(this.sidebar.offsetWidth)
            this._notifyListeners()
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

        window.addEventListener('resize', () => {
            this.totalWidthOfScreen = this.mainContainer.offsetWidth
        })

    }

    addListener(listener) {
        this.listeners.push(listener)
    }

    _updateWithWidth(width) {
        if (this.sidebar.className == "hidden") {
            this.leftOffsetForContent = this.defaultLeftOffsetForContent
            this.widthForContent = this.defaultWidthForContent
        }
        else {
            this.leftOffsetForContent = width
            this.widthForContent = this.defaultWidthForContent - width
        }
        console.log(width, this.leftOffsetForContent)
        this._notifyListeners()
    }

    _notifyListeners() {
        this.listeners.forEach((listener) => {
            listener.updateLeftOffsetWithNewOffset(this.leftOffsetForContent, this.widthForContent)
        })
    }
}