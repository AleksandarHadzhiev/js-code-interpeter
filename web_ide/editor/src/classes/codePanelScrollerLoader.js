import CustomHorizontalScrollbar from "../components/scrollbars/horizontal.js";
import CustomVerticalScrollbar from "../components/scrollbars/vertical.js";

export default class codePanelScrollerLoader {
    /**
     * 
     * @param {Number} screenWidth 
     * @param {Number} screenHeight 
     * @param {Number} loaderHeight 
     * @param {Number} lineContentWidth 
     */
    constructor(screenWidth, screenHeight, loaderHeight, lineContentWidth) {
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.loaderHeight = loaderHeight
        this.lineContentWidth = lineContentWidth
    }

    updateProportions(newWidth) {
        console.log(newWidth)
    }

    updateScreenSizes(newWidth, newHeight) {
        console.log(newWidth, newHeight)
    }

    updateHeight(height) {
        console.log(height)
    }

    updateLineContentWidth(newWidth) {
        console.log(newWidth)
    }
}