import CustomHorizontalScrollbar from "./scrollbars/horizontal.js"
import CustomVerticalScrollbar from "./scrollbars/vertical.js"
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
        const scrollableAreaVertical = new CustomVerticalScrollbar().buildScrollableAreaVertical()
        const scrollbarAreaHorizontal = new CustomHorizontalScrollbar().buildScrollableAreaHorizontal()
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
        const caretPlacer = this._buildCaretPlacer()
        contentElemet.appendChild(caretPlacer)
        contentElemet.appendChild(lineContent)
        contentElemet.appendChild(lineNumeration)
        return contentElemet
    }

    _buildCaretPlacer() {
        const caretPlacer = document.createElement('div')
        const caret = this._buildCaret()
        caretPlacer.setAttribute('id', 'caret-placer')
        caretPlacer.appendChild(caret)
        return caretPlacer
    }

    _buildCaret() {
        const caretElement = document.createElement('div')
        caretElement.classList.add('hidden')
        caretElement.setAttribute('id', 'caret')
        return caretElement
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
}

customElements.define('custom-editor-container', CustomEditorContainer)