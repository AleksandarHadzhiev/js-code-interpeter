export default class LineContentElementResizeObseever {
    constructor() {
        this.listeners = []
    }

    addListener(listener) {
        this.listeners.push(listener)
    }

    notifyListeners(newWidth) {
        this.listeners.forEach((listener) => {
            listener.updateLineContentWidth(newWidth)
        })
    }
}