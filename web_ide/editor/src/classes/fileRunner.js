import LinesLoader from "./scrollingMechanisms/LinesLoader.js"
import CaretTracker from "./caretTracker.js"
import LoaderHandler from "./scrollingMechanisms/LoaderHandler.js"
import TextSelection from "./selectionMechanisms/textSelection.js"
import MousePositionDefiner from "./mousePositionDefiner.js"

export default class FileRunner {
    /**
     * 
     * @param {String} text 
     */
    constructor(text) {
        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.contentElement = document.getElementById('content')
        this.mainContent = document.getElementById('container')
        this.loaderElement = document.getElementById('loader')
        this.minLineHeight = 28.8
        this.listOfPossibleLinesToDisplay = text.split('\n')
        this.amountOfLines = Math.round(this.contentElement.offsetHeight / this.minLineHeight)
        this.text = text
        this.linesLoader = new LinesLoader(
            this.amountOfLines, this.lineNumerationElement,
            this.lineContentElement, this.contentElement,
            this.listOfPossibleLinesToDisplay, this.minLineHeight,
            this.text
        )
        this.loaderHeight = this.listOfPossibleLinesToDisplay.length * this.minLineHeight

        const leftOffset = this.mainContent.offsetLeft + this.lineNumerationElement.offsetWidth
        const width = this.contentElement.offsetWidth - this.lineNumerationElement.offsetWidth
        const height = this.contentElement.offsetHeight
        const offsetTop = this.loaderElement.offsetTop
        this.mousePositionDefiner = new MousePositionDefiner(
            leftOffset,
            width,
            height,
            offsetTop,
            this.listOfPossibleLinesToDisplay.length)
        this.loaderElement.style = `height: ${this.loaderHeight}px;`
        console.log(this.mousePositionDefiner)
        window.addEventListener('mousemove', (event) => {
            const mousePosition = this.mousePositionDefiner.defineMousePosition(event)
            console.log(`Mouse Position: ${mousePosition}`)
        })
    }

    loadLines() {
        this.linesLoader.loadLines(this._updateWidths)
    }

    _updateWidths() {
        console.log("UPDATE WIDTHS")
    }
}