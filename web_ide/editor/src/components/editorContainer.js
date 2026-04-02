class CustomEditorContainer extends HTMLElement {
    constructor() {
        super()
        const container = this._buildEditor()
        this.appendChild(container)
    }

    _buildEditor() {
        const container = document.createElement('div')
        container.classList.add('editor-container')
        const editorView = this._buildEditorView()
        container.appendChild(editorView)
        return container
    }

    _buildEditorView() {
        const editorView = document.createElement('div')
        editorView.classList.add('editor-view')
        const interpreterScreen = this._buildInterpeterScreen()
        const scrollableAreaVertical = this._buildScrollableAreaVertical()
        const scrollbarAreaHorizontal = this._buildScrollableAreaHorizontal()
        editorView.appendChild(interpreterScreen)
        editorView.appendChild(scrollableAreaVertical)
        editorView.appendChild(scrollbarAreaHorizontal)
        return editorView
    }

    _buildInterpeterScreen() {
        const interpreterScreen = document.createElement('div')
        interpreterScreen.classList.add('interpreter-screen')
        const loader = this._buildLoader()
        interpreterScreen.appendChild(loader)
        return interpreterScreen
    }

    _buildLoader() {
        const loader = document.createElement('div')
        loader.classList.add('loader')
        loader.setAttribute('id', 'loader')
        const contentElement = this._buildContent()
        loader.appendChild(contentElement)
        return loader
    }

    _buildContent() {
        const contentElemet = document.createElement('div')
        contentElemet.classList.add('content')
        contentElemet.setAttribute('id', 'content')
        const lineNumeration = this._buildLineNumeration()
        const lineContent = this._buildLineContent()
        contentElemet.appendChild(lineNumeration)
        contentElemet.appendChild(lineContent)
        return contentElemet
    }

    _buildLineNumeration() {
        const lineNumeration = document.createElement('div')
        lineNumeration.setAttribute('id', 'line-numeration')
        return lineNumeration
    }

    _buildLineContent() {
        const lineContent = document.createElement('div')
        lineContent.setAttribute('id', 'line-content')
        return lineContent
    }

    _buildScrollableAreaVertical() {
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

    _buildScrollableAreaHorizontal() {
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

customElements.define('custom-editor-container', CustomEditorContainer)