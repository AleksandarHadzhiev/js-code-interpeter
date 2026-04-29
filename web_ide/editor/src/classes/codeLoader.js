import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import ContentPicker from './contentPicker.js'
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js";

export default class CodeLoader {
    /**
     * 
     * @param {HTMLElement} screen 
     * @param {Number} screenHeight 
     * @param {LoaderElementResizeObserver} loaderElementResizeObserver 
     */
    constructor(screen, screenHeight, loaderElementResizeObserver) {
        this.height = 0
        this.contentPicker = new ContentPicker()
        this.minLineHeight = 28.8
        this.loaderElementResizeObserver = loaderElementResizeObserver
        this.maxVisibileLinesOnScreen = Math.round(screenHeight / this.minLineHeight)
        this.linesLoader = new LinesLoader(this.maxVisibileLinesOnScreen, this.minLineHeight)
        this.loaderElementResizeObserver.addListener(this)
    }

    /**
     * 
     * @param {String} fileName 
     */
    loadContentFromFileWithName(fileName) {
        const text = this.contentPicker.pickTextFromFileWithName(fileName)
        this.linesLoader.loadContentForText(text)
        this.loaderElementResizeObserver.notifyListeners(this.linesLoader.maxLines)
    }

    /**
     * 
     * @param {Number} newHeight 
     */
    updateHeight(newHeight) {
        this.height = newHeight
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