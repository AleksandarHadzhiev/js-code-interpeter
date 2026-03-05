import FullTextSingleton from "./singleton.js"
import LineBUilder from "./line-builder.js"

class CustomContent extends HTMLElement {
    constructor() {
        super()
        this.classList.add('code-displayer')
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
        this.toBeScrolled = 0

        this.addEventListener('click', () => {
            this.writer.focus()
        })

        this.writer.addEventListener('input', (event) => {
            this._updateContentOnTheScreenOnNewContent(event.target.value)
        })

        this.parentElement.addEventListener('scroll', (event) => {
            this._updateVisibilityOfScrollbars()
            console.log("SCROLLING")
            this._updateContentOnScreenOnScrolling()
        })
    }

    _updateContentOnTheScreenOnNewContent(newContent) {
        console.log(this.parentElement.scrollWidth, this.parentElement.offsetWidth)
        this._calculateNumberOfLinesInFullText(newContent)
        this.loadLines(this.parent.scrollTop, this.content)
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
        const totalHeight = (this.lines * 28.8)
        const lines = this.content.split('\n')
        const width = (lines.sort((a, b) => b.length - a.length)[0].length * 20) + 35;
        this.reader.style = `height: ${totalHeight}px; width: ${width}px;`
        // this.style = `height: ${totalHeight}px; width: ${width}px;`
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

    loadLines(positionFromTheTop, content) {
        this.replaceChildren([])
        const lines = content.split('\n')
        const firstVisibleLine = Math.round(positionFromTheTop / 28.8)
        const length = this._defineNumberOfVisibleLinesBasedOnLinesAndPositionFromTop(lines, positionFromTheTop)
        for (let index = firstVisibleLine; index < length; index++) {
            this._generateTextForIndexInLines(index, lines)
        }
        return lines.length
    }

    _defineNumberOfVisibleLinesBasedOnLinesAndPositionFromTop(lines, positionFromTheTop) {
        const firstVisibleLine = Math.round(positionFromTheTop / 28.8)
        const maxLinesToDisplay = 35;
        const length = firstVisibleLine + maxLinesToDisplay > lines.length ? lines.length : firstVisibleLine + maxLinesToDisplay
        return length
    }

    _generateTextForIndexInLines(index, lines) {
        const content = lines[index]
        const builder = new LineBUilder(content)
        builder.buildLine()
        const lineContent = builder.buildLine()
        this.appendChild(lineContent)
    }
}

customElements.define('custom-content', CustomContent)