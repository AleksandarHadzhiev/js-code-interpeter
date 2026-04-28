export default class ResizeDraggerObserver {
    /**
     * 
     * @param {Number} defaultSidebarWidth 
     */
    constructor(defaultSidebarWidth) {
        this.resizeListeners = []
        this.defaultSidebarWidth = defaultSidebarWidth
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