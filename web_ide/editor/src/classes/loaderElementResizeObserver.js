export default class LoaderElementResizeObserver {
    constructor() {
        this.loaderElementResizeListeners = []
        this.minLineHeight = 28.8
    }

    addListener(listener) {
        this.loaderElementResizeListeners.push(listener)
    }

    notifyListeners(amountOfLines) {
        console.log(this.loaderElementResizeListeners)
        this.loaderElementResizeListeners.forEach(listener => {
            const height = amountOfLines * this.minLineHeight
            listener.updateHeight(height)
        });
    }
}