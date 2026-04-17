import TextSelection from "../selectionMechanisms/textSelection.js"
import ContentSizeChangesListener from "./contentSizeChangesListener.js"
import LoaderHandler from "../scrollingMechanisms/LoaderHandler.js"

export default class SizeChangesHandler {
    /**
     * 
     * @param {Number} minLineHeight 
     * @param {Number} lines 
     */
    constructor(minLineHeight, lines) {
        this.listeners = []
        this.maxLines = lines
        this.mainContainer = document.getElementById('container')
        this.screen = document.getElementById('screen')
        this.menuContainer = document.getElementById('menu')
        this.sidebar = document.getElementById('sidebar')
        this.contentElement = document.getElementById('content')
        this.resizeDragger = document.getElementById('resize-dragger')
        this.navigationElement = document.getElementById('navigation')
        this.loaderElement = document.getElementById('loader')
        this.defaultLeftOffsetForContent = this.menuContainer.offsetWidth
        this.leftOffsetForContent = this.defaultLeftOffsetForContent
        this.defaultWidthForContent = this.screen.offsetWidth - this.defaultLeftOffsetForContent
        this.widthForContent = this.defaultWidthForContent
        this.totalWidthOfScreen = this.mainContainer.offsetWidth
        this.contentOffsetTop = this.navigationElement.offsetHeight
        this.editorHeight = this.mainContainer.offsetHeight - this.contentOffsetTop
        this.maxVisibleLinesOnScreen = Math.ceil(this.editorHeight / minLineHeight)
        let loaderHeightInLines = lines > this.maxVisibleLinesOnScreen - 1 ? (lines + this.maxVisibleLinesOnScreen - 1) : lines
        this.loaderHeight = loaderHeightInLines * minLineHeight
        this._addListeners()
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

        window.addEventListener('resize', () => {
            this.totalWidthOfScreen = this.mainContainer.offsetWidth
        })

    }

    _addListeners() {
        const contentSizeChangesListener = new ContentSizeChangesListener(this.mainContainer)
        // const loaderHandler = new LoaderHandler(this.loaderHeight, this.editorHeight, this.loaderElement)
        // const textSelection = new TextSelection(
        //     this.contentOffsetTop, this.totalWidthOfScreen,
        //     this.editorHeight, this.widthForContent,
        //     this.contentElement, this.defaultLeftOffsetForContent,
        //     this.maxLines, null
        // )
        this.listeners.push(contentSizeChangesListener)
        // this.listeners.push(loaderHandler)
        // this.listeners.push(textSelection)
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