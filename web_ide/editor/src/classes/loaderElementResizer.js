export default class LoaderElementResizer {
    /**
     * 
     * @param {HTMLElement} loaderElement 
     */
    constructor(loaderElement) {
        this.loader = loaderElement
    }

    /**
     * 
     * @param {Number} height 
     */
    updateHeight(height) {
        this.loader.style = `height: ${height}px;`
    }
}