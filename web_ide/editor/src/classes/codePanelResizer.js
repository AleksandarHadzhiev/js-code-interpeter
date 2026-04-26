export default class CodePanelResizer {
    constructor() {
        this.content = document.getElementById('content')
        this.screen = document.getElementById('screen')
        this.menu = document.getElementById('menu')
        this.defaultMenuWidth = this.menu.offsetWidth
        this.screenWidth = this.screen.offsetWidth
        this.defaultWidth = this.screenWidth - this.defaultMenuWidth
        this.width = this.defaultWidth
        this.menu.addEventListener('resized', (event) => {
            const leftOffset = event.detail.sidebarWidth - this.defaultMenuWidth
            this.width = this.screenWidth - leftOffset
            this.content.style = `
                left: ${leftOffset}px;
                width: ${this.width}px;
            `
        })
    }
}