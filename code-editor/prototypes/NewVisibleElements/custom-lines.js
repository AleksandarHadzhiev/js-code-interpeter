import FullTextSingleton from "./singleton.js"
import CustomLineNumeration from "./custom-line-numeration.js"


class CustomLinesTracker extends HTMLElement {
    constructor() {
        super()
    }

    loadLines(positionFromTheTop, content) {
        this.replaceChildren([])
        const firstVisibleLine = Math.round(positionFromTheTop / 28.8)
        const length = this._defineNumberOfLinesBasedonPositionFromTheTopAndContent(positionFromTheTop, content)
        for (let index = firstVisibleLine; index < length; index++) {
            const lineNumberation = new CustomLineNumeration(index)
            this.appendChild(lineNumberation)
        }
        return firstVisibleLine
    }

    _defineNumberOfLinesBasedonPositionFromTheTopAndContent(positionFromTheTop, content) {
        const lines = content.split('\n').length
        console.log(this.parentElement.scrollLeft)
        const firstVisibleLine = Math.round(positionFromTheTop / 28.8)
        const maxLinesToDisplay = 35;
        return firstVisibleLine + maxLinesToDisplay > lines ? lines : firstVisibleLine + maxLinesToDisplay
    }
}

customElements.define('custom-lines-tracker', CustomLinesTracker)