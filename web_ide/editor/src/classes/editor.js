import CodePanelResizer from "./codePanelResizer.js";
import MousePositionDefiner from "./mousePositionDefiner.js";
export default class Editor {
    constructor() {
        this.menu = document.getElementById('menu')
        this.screen = document.getElementById('screen')
        this.defaultMenuWidth = this.menu.offsetWidth
        this.widthOfScreen = this.screen.offsetWidth
        this.codePanelResizer = new CodePanelResizer(this.menu, this.defaultMenuWidth, this.widthOfScreen)
        this.mousePositionDefiner = new MousePositionDefiner()
        this.menu.addEventListener('resized', (event) => {
            const leftOffset = event.detail.sidebarWidth - this.defaultMenuWidth + 75
            const width = this.widthOfScreen - leftOffset
            this.mousePositionDefiner.updateLeftOffsetWithNewOffset(leftOffset, width)
        })
        window.addEventListener('mousemove', (event) => {
            this.mousePositionDefiner.defineMousePosition(event)
        })
    }
}