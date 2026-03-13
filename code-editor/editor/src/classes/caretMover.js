import ScrollOnCaretMovement from "./scrollingMechanisms/scrollOnCaretMovement.js"

export default class CaretMover {

    /**
     * 
     * @param {ScrollOnCaretMovement} scroller 
     */
    constructor(scroller) {
        this.scroller = scroller
    }

    /**
     * @param {String} keybordKey
     * @param {HTMLElement} caret
     */
    moveCaretBasedOnKeybordKey(keybordKey, caret) {
        console.log(keybordKey)
        // 4 Possible flows
        if (keybordKey == "ArrowLeft") {
            // move left
        }
        else if (keybordKey == "ArrowRight") {
            // move right
        }
        else if (keybordKey == "ArrowUp") {
            this._moveUp(caret)
        }
        else if (keybordKey == "ArrowDown") {
            this._moveDown(caret)
        }
    }

    /**
     * @param {HTMLElement} caret
     */
    _moveUp(caret) {
        const topOffset = caret.offsetTop
        const leftOffset = caret.offsetLeft
        console.log(topOffset, leftOffset)
        if (topOffset > 0) {
            const lineId = Math.round(topOffset / 28.8)
            const newLineId = lineId - 1
            const lineElement = document.getElementById(String(newLineId))
            const newOffset = lineElement.offsetTop
            caret.style = `top: ${newOffset}px; left: ${leftOffset}px;`
            const firstVisibleLine = this.scroller.linesLoader.firstVisibleLine
            console.log(newLineId, firstVisibleLine)
            if (newLineId - firstVisibleLine <= 5) {
                this.scroller.updateOffset(-28.8)
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} caret 
     */
    _moveDown(caret) {
        const topOffset = caret.offsetTop
        const leftOffset = caret.offsetLeft
        if (topOffset < 2000 * 28.8) {
            const lineId = Math.round(topOffset / 28.8)
            const newLineId = lineId + 1
            const lineElement = document.getElementById(String(newLineId))
            const newOffset = lineElement.offsetTop
            caret.style = `top: ${newOffset}px; left: ${leftOffset}px;`
            const lastVisibleLine = this.scroller.linesLoader.lastVisibleLine - 1
            console.log(lastVisibleLine, newLineId)
            if (lastVisibleLine - newLineId <= 5 && lastVisibleLine - newLineId > 0) {
                this.scroller.updateOffset(28.8)
            }
        }
    }
}