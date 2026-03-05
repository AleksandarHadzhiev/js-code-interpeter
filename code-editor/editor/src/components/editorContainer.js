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
        const scrollableArea = this._buildScrollableArea()
        editorView.appendChild(scrollableArea)
        return editorView
    }

    _buildInterpeterScreen() {

    }

    _buildScrollableArea() {
        const scrollablearea = document.createElement('div')
        scrollablearea.classList.add('scrollable-area')
        const scrollbar = this._buildScrollbar()
        scrollablearea.appendChild(scrollbar)
        return scrollablearea
    }

    _buildScrollbar() {
        const scrollbar = document.createElement('div')
        scrollbar.setAttribute('id', 'scrollbar')
        const bar = this._buildBar()
        scrollbar.appendChild(bar)
        return scrollbar
    }

    _buildBar() {
        const bar = document.createElement('div')
        bar.setAttribute('id', 'bar')
        return bar
    }
}

customElements.define('custom-editor-container', CustomEditorContainer)