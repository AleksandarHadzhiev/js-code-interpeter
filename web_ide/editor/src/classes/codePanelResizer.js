export default class CodePanelResizer {
    /**
     * 
     * @param {HTMLElement} menuElement 
     * @param {Number} defaultMenuWidth 
     * @param {Number} screenWidth 
     * @param {HTMLElement} screen 
     */
    constructor(menuElement, defaultMenuWidth, screenWidth, screen) {
        this.content = document.getElementById('content')
        this.screenWidth = screenWidth
        this.defaultWidth = this.screenWidth - defaultMenuWidth
        this.width = this.defaultWidth
        this.leftOffset = 0
        menuElement.addEventListener('resizing', (event) => {
            this.leftOffset = event.detail.sidebarWidth - defaultMenuWidth
            this.width = this.screenWidth - this.leftOffset
            this.content.style = `
                left: ${this.leftOffset}px;
                width: ${this.width}px;
            `
        })

        window.addEventListener('resize', (event) => {
            this.screenWidth = screen.offsetWidth
            this.width = this.screenWidth - this.leftOffset
            this.content.style = `
                left: ${this.leftOffset}px;
                width: ${this.width}px;
            `
            screen.dispatchEvent(new Event('resized'))
        })
    }
}