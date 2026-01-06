import FullTextSingleton from "./singleton.js"

class CustomReader extends HTMLElement {
    constructor() {
        super()
        this.horizontalBar = document.getElementById('horizontal')
        this.verticalBar = document.getElementById('vertical')
        this.reader = document.getElementById('reader')
        this.contentElement = document.getElementById('content')
        this.linesTracker = document.getElementById('lines')
        this.fullText = new FullTextSingleton("")
        this.writer = document.getElementById('writer')
        this.parent = this.parentElement
        this.content = this.fullText.getWholeText()
        this.lines = 0
        this.writer.addEventListener('input', (event) => {
            this._updateContentOnTheScreenOnNewContent(event.target.value)
        })

        this.parentElement.addEventListener('scroll', (event) => {
            this._updateContentOnScreenOnScrolling()
        })
    }

    _updateContentOnTheScreenOnNewContent(newContent) {
        this._calculateNumberOfLinesInFullText(newContent)
        this.contentElement.loadLines(this.parent.scrollTop, this.content)
        this._applyWidthAndHeight()
        this.linesTracker.loadLines(this.parent.scrollTop, this.content)
        this._updateVisibilityOfScrollbars()
    }

    _calculateNumberOfLinesInFullText(newContent) {
        this.fullText.updateWholeText(newContent)
        this.content = this.fullText.getWholeText()
        this.lines = this.content.split('\n').length
    }

    _applyWidthAndHeight() {
        const width = this.contentElement.scrollWidth
        this.writer.value = ""
        const totalHeight = (this.lines * 28.8)
        this.style = `
                height: ${totalHeight}px;
                width: ${width}px;`
    }

    _updateVisibilityOfScrollbars() {
        this.verticalBar.changeVisibilityBasedOnHeight()
        this.horizontalBar.changeVisibilityBasedOnWidth()
    }

    _updateContentOnScreenOnScrolling() {
        this.horizontalBar.scrollHorizontally()
        this.verticalBar.scrollVertically()
        this.contentElement.loadLines(this.parent.scrollTop, this.content)
        this.linesTracker.loadLines(this.parent.scrollTop, this.content)
    }
}

customElements.define('custom-reader', CustomReader)