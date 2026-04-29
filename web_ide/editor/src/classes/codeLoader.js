import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import ContentPicker from './contentPicker.js'
export default class CodeLoader {
    /**
     * 
     * @param {HTMLElement} screen 
     * @param {Number} screenHeight 
     * @param {HTMLElement} loaderElement
     */
    constructor(screen, screenHeight, loaderElement) {
        this.loaderElement = loaderElement
        this.height = 0
        this.contentPicker = new ContentPicker()
        this.minLineHeight = 28.8
        this.maxVisibileLinesOnScreen = Math.round(screenHeight / this.minLineHeight)
        this.linesLoader = new LinesLoader(this.maxVisibileLinesOnScreen, this.minLineHeight)
    }

    /**
     * 
     * @param {String} fileName 
     */
    loadContentFromFileWithName(fileName) {
        const text = this.contentPicker.pickTextFromFileWithName(fileName)
        this.linesLoader.loadContentForText(text)
        // this should be updated in other places as well
        this.height = this.linesLoader.maxLines * this.minLineHeight
        this.loaderElement.style = `height: ${this.height}px;`
    }

    /**
 * 
 * @param {Number} newWidth 
 * @param {Number} newHeight 
 */
    updateScreenSizes(newWidth, newHeight) {
        this.maxVisibileLinesOnScreen = Math.round(newHeight / this.minLineHeight)
        // this should not happen always, only when there is a selected file..
        this.linesLoader.updateMaxVisibleLinesOnScreen(this.maxVisibileLinesOnScreen)
    }

    /**
     * 
     * @param {Number} offset 
     */
    updateVisibleLinesOnVerticalScrolling(offset) {
        this.linesLoader.reloadLinesForNewTopOffset(offset)
    }
}