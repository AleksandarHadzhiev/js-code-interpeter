export default class CustomHorizontalScrollbar {

    buildScrollableAreaHorizontal() {
        const scrollablearea = document.createElement('div')
        scrollablearea.classList.add('scrollable-area-horizontal')
        scrollablearea.setAttribute('id', 'scrollable-area-horizontal')
        const scrollbar = this._buildScrollbarHorizontal()
        scrollablearea.appendChild(scrollbar)
        return scrollablearea
    }

    _buildScrollbarHorizontal() {
        const scrollbar = document.createElement('div')
        scrollbar.setAttribute('id', 'scrollbar-horizontal')
        const bar = this._buildBarHorizontal()
        scrollbar.appendChild(bar)
        return scrollbar
    }

    _buildBarHorizontal() {
        const bar = document.createElement('div')
        bar.setAttribute('id', 'bar-horizontal')
        return bar
    }
}

