import ContentSizeChangesListener from "./contentSizeChangesListener.js"

export default class SizeChangesHandler {
    constructor() {
        this.listeners = []
        this.mainContainer = document.getElementById('container')
        const contentSizeChangesListener = new ContentSizeChangesListener(this.mainContainer)
        this.listeners.push(contentSizeChangesListener)
        this.menuContainer = document.getElementById('menu')
        this.sidebar = document.getElementById('sidebar')
        this.navigationElement = document.getElementById('navigation')
        this.loaderElement = document.getElementById('loader')
        this.writerElement = document.getElementById('writer')

        this.scrollbarElementVertical = document.getElementById('scrollbar-vertical')
        this.scrollbarAreaElementVertical = document.getElementById('scrollable-area-vertical')
        this.barVerticalElement = document.getElementById('bar-vertical')
        this.placer = document.getElementById('caret-placer')

        this.scrollbarElementHorizontal = document.getElementById('scrollbar-horizontal')
        this.scrollbarAreaElementHorizontal = document.getElementById('scrollable-area-horizontal')
        this.barHorizontalElement = document.getElementById('bar-horizontal')

        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.contentElement = document.getElementById('content')

        this.defaultLeftOffsetForContent = this.menuContainer.offsetWidth

        this.sidebar.addEventListener('visibilityChanged', () => {
            if (this.sidebar.className == "hidden") {
                this.leftOffsetForContent = this.defaultLeftOffsetForContent
            }
            else {
                this.leftOffsetForContent = this.defaultLeftOffsetForContent + this.sidebar.offsetWidth
            }
            this._notifyListeners()
        })
    }

    _notifyListeners() {
        this.listeners.forEach((listener) => {
            listener.updateLeftOffsetWithNewOffset(this.leftOffsetForContent)
        })
    }
}