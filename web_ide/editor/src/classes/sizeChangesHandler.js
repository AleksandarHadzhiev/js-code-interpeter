export default class SizeChangesHandler {
    constructor() {
        this.mainContainer = document.getElementById('container')
        this.menuContainer = document.getElementById('menu')
        this.sidebar = document.getElementById('sidebar')
        this.navigationElement = document.getElementById('navigation')
        this.loaderElement = document.getElementById('loader')
        this.writerElement = document.getElementById('writer')

        this.scrollbarElementVertical = document.getElementById('scrollbar-vertical')
        this.scrollbarAreaElementVertical = document.getElementById('scrollable-area-vertical')
        this.barVerticalElement = document.getElementById('bar-vertical')
        this.placer = document.getElementById('caret-placer')

        this.scrollbarElementHorizontal = document.getElementById('scrollbar-horizontal')
        this.scrollbarAreaElementHorizontal = document.getElementById('scrollable-area-horizontal')
        this.barHorizontalElement = document.getElementById('bar-horizontal')

        this.lineNumerationElement = document.getElementById('line-numeration')
        this.lineContentElement = document.getElementById('line-content')
        this.contentElement = document.getElementById('content')

        this.leftOffsetForContent = this.menuContainer.offsetWidth

        this.sidebar.addEventListener('visibilityChanged', () => {
            if (this.sidebar.className == "hidden") {
                console.log("CHANGED VISIBILITY - HIDDEN")
                this.leftOffsetForContent = this.menuContainer.offsetWidth
                console.log(this.leftOffsetForContent)
            }
            else {
                console.log("CHANGED VISIBILITY - VISIBLE")
                this.leftOffsetForContent = this.menuContainer.offsetWidth + this.sidebar.offsetWidth
                console.log(this.leftOffsetForContent)
            }
        })
    }

}