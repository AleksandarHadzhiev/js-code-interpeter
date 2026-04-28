import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import ContentPicker from './contentPicker.js'
export default class CodeLoader {
    /**
     * 
     * @param {HTMLElement} screen 
     * @param {Number} screenHeight 
     */
    constructor(screen, screenHeight) {
        this.screenElement = screen
        this.loaderElement = document.getElementById('loader')
        this.contentPicker = new ContentPicker()
        this.minLineHeight = 28.8
        this.maxVisibileLinesOnScreen = Math.round(screenHeight / this.minLineHeight)
        this.linesLoader = new LinesLoader(this.maxVisibileLinesOnScreen, this.minLineHeight)
        this.screenElement.addEventListener('loadFile', (event) => {
            const fileName = event.detail.fileName
            const text = this.contentPicker.pickTextFromFileWithName(fileName)
            this.linesLoader.loadContentForText(text)
            this.loaderElement.style = `height: ${this.linesLoader.maxLines * this.minLineHeight}px;`
        })
    }

    /**
 * 
 * @param {Number} newWidth 
 * @param {Number} newHeight 
 */
    updateScreenSizes(newWidth, newHeight) {
        this.maxVisibileLinesOnScreen = Math.round(newHeight / this.minLineHeight)
        this.linesLoader.updateMaxVisibleLinesOnScreen(this.maxVisibileLinesOnScreen)
    }

}