import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import ContentPicker from './contentPicker.js'
export default class CodeLoader {
    constructor() {
        this.screenElement = document.getElementById('screen')
        this.loaderElement = document.getElementById('loader')
        this.contentPicker = new ContentPicker()
        this.minLineHeight = 28.8
        this.maxVisibileLinesOnScreen = Math.round(this.screenElement.offsetHeight / this.minLineHeight)
        this.linesLoader = new LinesLoader(this.maxVisibileLinesOnScreen, this.minLineHeight)
        this.screenElement.addEventListener('loadFile', (event) => {
            const fileName = event.detail.fileName
            const text = this.contentPicker.pickTextFromFileWithName(fileName)
            this.linesLoader.loadContentForText(text)
            this.loaderElement.style = `height: ${this.linesLoader.maxLines * this.minLineHeight}px;`
        })
    }
}