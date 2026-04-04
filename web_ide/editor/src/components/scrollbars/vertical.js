export default class CustomVerticalScrollbar {
    buildScrollableAreaVertical() {
        const scrollablearea = document.createElement('div')
        scrollablearea.classList.add('scrollable-area-vertical')
        scrollablearea.setAttribute('id', 'scrollable-area-vertical')
        const scrollbar = this._buildScrollbarVertical()
        scrollablearea.appendChild(scrollbar)
        return scrollablearea
    }

    _buildScrollbarVertical() {
        const scrollbar = document.createElement('div')
        scrollbar.setAttribute('id', 'scrollbar-vertical')
        const bar = this._buildBarVertical()
        scrollbar.appendChild(bar)
        return scrollbar
    }

    _buildBarVertical() {
        const bar = document.createElement('div')
        bar.setAttribute('id', 'bar-vertical')
        return bar
    }
}
