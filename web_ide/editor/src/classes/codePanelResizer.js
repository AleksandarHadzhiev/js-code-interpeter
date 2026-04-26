export default class CodePanelResizer {
    /**
     * 
     * @param {HTMLElement} menuElement 
     * @param {Number} defaultMenuWidth 
     * @param {Number} screenWidth 
     */
    constructor(menuElement, defaultMenuWidth, screenWidth) {
        this.content = document.getElementById('content')
        this.defaultWidth = screenWidth - defaultMenuWidth
        this.width = this.defaultWidth
        menuElement.addEventListener('resizing', (event) => {
            const leftOffset = event.detail.sidebarWidth - defaultMenuWidth
            this.width = screenWidth - leftOffset
            this.content.style = `
                left: ${leftOffset}px;
                width: ${this.width}px;
            `
        })
    }
}