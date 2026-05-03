import LinesLoader from "./scrollingMechanisms/LinesLoader.js";
import ContentPicker from './contentPicker.js'
import LoaderElementResizeObserver from "./loaderElementResizeObserver.js";
import calculateWidthForText from "./calculators/widthOfTextCalculator.js";
import LineContentElementResizeObseever from "./lineContentElementResizeObserver.js";

export default class CodeLoader {
    /**
     * @param {HTMLElement} screen 
     * @param {Number} screenHeight 
     * @param {LoaderElementResizeObserver} loaderElementResizeObserver
     * @param {HTMLElement} lineNumerationElement
     * @param {HTMLElement} lineContentElement   
     * @param {LineContentElementResizeObseever} lineElementResizeObserver
     */
    constructor(screen, screenHeight, loaderElementResizeObserver, lineNumerationElement, lineContentElement, lineElementResizeObserver) {
        this.lineNumerationElement = lineNumerationElement
        this.lineContentElement = lineContentElement
        this.height = 0
        this.contentPicker = new ContentPicker()
        this.minLineHeight = 28.8
        this.loaderElementResizeObserver = loaderElementResizeObserver
        this.maxVisibileLinesOnScreen = Math.round(screenHeight / this.minLineHeight)
        this.linesLoader = new LinesLoader(this.maxVisibileLinesOnScreen, this.minLineHeight, this.lineContentElement, this.lineNumerationElement)
        this.bufferZoneForLineContent = 150
        this.lineElementResizeObserver = lineElementResizeObserver
    }

    /**
     * 
     * @param {String} fileName 
     * @param {String} longestLine 
     */
    loadContentFromFileWithName(fileName, longestLine) {
        const text = this.contentPicker.pickTextFromFileWithName(fileName)
        this.linesLoader.loadContentForText(text)
        this.loaderElementResizeObserver.notifyListeners(this.linesLoader.maxLines)
        const width = calculateWidthForText(this.lineContentElement, longestLine) + this.bufferZoneForLineContent
        this.lineElementResizeObserver.notifyListeners(width)
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