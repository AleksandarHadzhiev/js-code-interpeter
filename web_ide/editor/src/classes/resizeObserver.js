export default class ResizeDraggerObserver {
    constructor() {
        this.resizeListeners = []
    }

    addResizeListener(resizeListener) {
        this.resizeListeners.push(resizeListener)
    }

    /**
     * 
     * @param {Number} newWidth 
     */
    notifyResizeListeners(newWidth) {
        this.resizeListeners.forEach(resizeListener => {
            resizeListener.updateProportions(newWidth)
        });
    }
}