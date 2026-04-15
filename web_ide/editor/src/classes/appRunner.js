import LinesLoader from "./scrollingMechanisms/LinesLoader.js"

export default class AppRunner {
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
        this.amountOfLines = this.listOfPossibleLinesToDisplay.length
        this.text = text
        this.linesLoader = new LinesLoader(
            this.amountOfLines, this.lineNumerationElement,
            this.lineContentElement, this.contentElement,
            this.listOfPossibleLinesToDisplay, this.minLineHeight,
            this.text
        )
    }

    loadLines() {
        this.linesLoader.loadLines(null)
    }
}