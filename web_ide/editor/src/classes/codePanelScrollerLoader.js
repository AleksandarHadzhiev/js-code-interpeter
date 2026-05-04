import CustomHorizontalScrollbar from "../components/scrollbars/horizontal.js";
import CustomVerticalScrollbar from "../components/scrollbars/vertical.js";

export default class codePanelScrollerLoader {
    /**
     * @param {Number} menuWiwth
     * @param {Number} lineNumerationtWidth
     * @param {Number} screenWidth 
     * @param {Number} screenHeight 
     */
    constructor(menuWiwth, lineNumerationtWidth, screenWidth, screenHeight) {
        this.editorView = document.getElementById('editor-view')
        this.barVerticalWidth = 25
        this.menuWiwth = menuWiwth
        this.leftOffset = this.menuWiwth
        this.codePanelWidth = screenWidth
        this.lineNumerationtWidth = lineNumerationtWidth
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.loaderHeight = 0
        this.lineContentWidth = 0
        this.customHorizontalScrollbar = new CustomHorizontalScrollbar()
        this.customVerticalScrollbar = new CustomVerticalScrollbar()
    }

    updateProportions(newWidth) {
        this.leftOffset = newWidth + this.lineNumerationtWidth
        console.log(this.leftOffset)
        this.codePanelWidth = this.screenWidth - this.leftOffset
        console.log(this.codePanelWidth)
    }

    updateScreenSizes(newWidth, newHeight) {
        console.log(newWidth, newHeight)
    }

    updateHeight(height) {
        this.loaderHeight = height
        this._changeVisibilityForVerticalScrollbar()
    }

    updateLineContentWidth(newWidth) {
        this.lineContentWidth = newWidth
        this._changeVisibilityForHorizontalScrollbar()

        console.log(newWidth)
    }

    _changeVisibilityForHorizontalScrollbar() {
        if (this.lineContentWidth > this.codePanelWidth) {
            const horizontalBar = this.customHorizontalScrollbar.buildScrollableAreaHorizontal()
            let width = this.codePanelWidth - this.barVerticalWidth
            horizontalBar.style = `left: ${this.leftOffset}px; width: ${width}px;`
            this.editorView.appendChild(horizontalBar)
        }
        else if (this.lineNumerationtWidth < this.codePanelWidth) {
            const sidebar = document.getElementById('scrollable-area-horizontal')
            if (sidebar) sidebar.remove()
        }
    }

    _changeVisibilityForVerticalScrollbar() {
        if (this.loaderHeight > this.screenHeight) {
            const verticalBar = this.customVerticalScrollbar.buildScrollableAreaVertical()
            this.editorView.appendChild(verticalBar)
        }
        else if (this.loaderHeight < this.screenHeight) {
            const sidebar = document.getElementById('scrollable-area-vertical')
            if (sidebar)
                sidebar.remove()
        }
    }
}