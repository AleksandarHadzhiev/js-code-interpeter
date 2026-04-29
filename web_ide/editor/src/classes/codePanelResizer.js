export default class CodePanelResizer {
    /**
     * 
     * @param {Number} defaultMenuWidth 
     * @param {Number} screenWidth 
     * @param {HTMLElement} screen 
     */
    constructor(defaultMenuWidth, screenWidth, screen) {
        this.content = document.getElementById('content')
        this.screenWidth = screenWidth
        this.defaultMenuWidth = defaultMenuWidth
        this.defaultWidth = this.screenWidth - defaultMenuWidth
        this.width = this.defaultWidth
        this.leftOffset = 0

        window.addEventListener('resize', (event) => {
            this.screenWidth = screen.offsetWidth
            this.width = this.screenWidth - this.leftOffset
            this.content.style = `
                left: ${this.leftOffset}px;
                width: ${this.width}px;
            `
        })
    }

    /**
 * 
 * @param {Number} width 
 */
    updateProportions(width) {
        this.leftOffset = width
        this.width = this.screenWidth - this.leftOffset
        this.content.style = `
                left: ${this.leftOffset}px;
                width: ${this.width}px;
            `
    }
}