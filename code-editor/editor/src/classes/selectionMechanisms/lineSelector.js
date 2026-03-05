export default class LineSelector {
    /**
     * 
     * @param {MouseEvent} event 
     */
    constructor(event) {
        this.mouseEvent = event
    }

    selectLine() {
        const contentElement = document.getElementById('content')
        const targetElement = this.mouseEvent.currentTarget
        const selector = this._buildSelector()
        this._positionSelectorBasedonTarget(selector, targetElement)
        contentElement.appendChild(selector)
    }

    _buildSelector() {
        let selector = document.getElementById('line-selector')
        if (selector == null) {
            selector = document.createElement('div')
            selector.classList.add('line-selector')
            selector.setAttribute('id', 'line-selector')
        }
        return selector
    }

    /**
     * @param {HTMLElement} selector 
     * @param {EventTarget} target
     */
    _positionSelectorBasedonTarget(selector, target) {
        selector.style = `top: ${target.offsetTop}px;`
    }
}