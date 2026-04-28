export default class ScreenResizerObserver {
    constructor() {
        this.screenResizeListeners = []
    }

    addScreenResizeListener(screenResizeListener) {
        this.screenResizeListeners.push(screenResizeListener)
    }

    /**
     * 
     * @param {Number} newWidth 
     * @param {Number} newHeight
     */
    notifyResizeListeners(newWidth, newHeight) {
        this.screenResizeListeners.forEach(screenResizeListener => {
            screenResizeListener.updateScreenSizes(newWidth, newHeight)
        });
    }
}