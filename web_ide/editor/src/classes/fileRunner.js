import LinesLoader from "./scrollingMechanisms/LinesLoader.js"
import CaretTracker from "./caretTracker.js"

export default class FileRunner {
    /**
     * 
     * @param {String} text 
     */
    constructor(text) {
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.contentElement = document.getElementById('content')
        this.minLineHeight = 28.8
        this.listOfPossibleLinesToDisplay = text.split('\n')
        this.amountOfLines = Math.round(this.contentElement.offsetHeight / 28.8)
        this.text = text
        this.linesLoader = new LinesLoader(
            this.amountOfLines, this.lineNumerationElement,
            this.lineContentElement, this.contentElement,
            this.listOfPossibleLinesToDisplay, this.minLineHeight,
            this.text
        )
        this.caretTracker = new CaretTracker(
            this.contentElement, this.minLineHeight, this.amountOfLines, this.linesLoader
        )
    }

    loadLines() {
        this.linesLoader.loadLines(this._updateWidths)
    }

    _updateWidths() {
        console.log("UPDATE WIDTHS")
    }
}