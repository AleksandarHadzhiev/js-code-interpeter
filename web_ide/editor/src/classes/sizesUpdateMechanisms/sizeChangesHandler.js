import TextSelection from "../selectionMechanisms/textSelection.js"
import ContentSizeChangesListener from "./contentSizeChangesListener.js"

export default class SizeChangesHandler {
    /**
     * 
     * @param {TextSelection} textSelection 
     */
    constructor(textSelection) {
        this.listeners = [textSelection]
        this.mainContainer = document.getElementById('container')
        this.screen = document.getElementById('screen')
        this._addListeners()

        this.menuContainer = document.getElementById('menu')
        this.sidebar = document.getElementById('sidebar')
        this.resizeDragger = document.getElementById('resize-dragger')

        this.defaultLeftOffsetForContent = this.menuContainer.offsetWidth
        this.leftOffsetForContent = this.defaultLeftOffsetForContent
        this.defaultWidthForContent = this.screen.offsetWidth - this.defaultLeftOffsetForContent
        this.widthForContent = this.defaultWidthForContent
        this.sidebar.addEventListener('visibilityChanged', () => {
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
    }

    _addListeners() {
        const contentSizeChangesListener = new ContentSizeChangesListener(this.mainContainer)
        // const scrollbarHorizontalSizeChangesListener = new ScrollbarHorizontalSizeChangesListener(this.scrollbarElementHorizontal)
        this.listeners.push(contentSizeChangesListener)
        // this.listeners.push(scrollbarHorizontalSizeChangesListener)
    }

    _updateWithWidth(width) {
        if (this.sidebar.className == "hidden") {
            this.leftOffsetForContent = this.defaultLeftOffsetForContent
            this.widthForContent = this.defaultWidthForContent
        }
        else {
            this.leftOffsetForContent = this.defaultLeftOffsetForContent + width
            this.widthForContent = this.defaultWidthForContent - width
        }
        this._notifyListeners()
    }

    _notifyListeners() {
        this.listeners.forEach((listener) => {
            listener.updateLeftOffsetWithNewOffset(this.leftOffsetForContent, this.widthForContent)
        })
    }
}