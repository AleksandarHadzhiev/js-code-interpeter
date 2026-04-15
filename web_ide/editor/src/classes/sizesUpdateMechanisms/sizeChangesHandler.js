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