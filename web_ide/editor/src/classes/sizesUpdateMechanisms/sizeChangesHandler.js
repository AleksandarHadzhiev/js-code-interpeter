import ContentSizeChangesListener from "./contentSizeChangesListener.js"
import ScrollbarHorizontalSizeChangesListener from "./scrollbarHorizontalSizeChangesListener.js"

export default class SizeChangesHandler {
    constructor() {
        this.listeners = []
        this.mainContainer = document.getElementById('container')
        this.scrollbarElementHorizontal = document.getElementById('scrollbar-horizontal')
        this.scrollbarAreaElementHorizontal = document.getElementById('scrollable-area-horizontal')
        this.barHorizontalElement = document.getElementById('bar-horizontal')
        this.screen = document.getElementById('screen')
        this._addListeners()

        this.menuContainer = document.getElementById('menu')
        this.sidebar = document.getElementById('sidebar')
        this.navigationElement = document.getElementById('navigation')
        this.loaderElement = document.getElementById('loader')
        this.writerElement = document.getElementById('writer')

        this.scrollbarElementVertical = document.getElementById('scrollbar-vertical')
        this.scrollbarAreaElementVertical = document.getElementById('scrollable-area-vertical')
        this.barVerticalElement = document.getElementById('bar-vertical')
        this.placer = document.getElementById('caret-placer')


        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.contentElement = document.getElementById('content')

        this.defaultLeftOffsetForContent = this.menuContainer.offsetWidth
        this.leftOffsetForContent = this.defaultLeftOffsetForContent
        this.defaultWidthForContent = this.screen.offsetWidth - this.defaultLeftOffsetForContent
        this.widthForContent = this.defaultWidthForContent
        this.sidebar.addEventListener('visibilityChanged', () => {
            if (this.sidebar.className == "hidden") {
                this.leftOffsetForContent = this.defaultLeftOffsetForContent
                this.widthForContent = this.defaultWidthForContent
            }
            else {
                this.leftOffsetForContent = this.defaultLeftOffsetForContent + this.sidebar.offsetWidth
                this.widthForContent = this.defaultWidthForContent - this.sidebar.offsetWidth
            }
            this._notifyListeners()
        })
    }

    _addListeners() {
        const contentSizeChangesListener = new ContentSizeChangesListener(this.mainContainer)
        // const scrollbarHorizontalSizeChangesListener = new ScrollbarHorizontalSizeChangesListener(this.scrollbarElementHorizontal)
        this.listeners.push(contentSizeChangesListener)
        // this.listeners.push(scrollbarHorizontalSizeChangesListener)
    }

    _notifyListeners() {
        this.listeners.forEach((listener) => {
            listener.updateLeftOffsetWithNewOffset(this.leftOffsetForContent, this.widthForContent)
        })
    }
}