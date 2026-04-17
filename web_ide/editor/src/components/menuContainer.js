class CustomMenuContainer extends HTMLElement {
    constructor() {
        super()
        this.screen = document.getElementById('screen')
        this.elements = []
        this.sidebarTitle = null
        const explorer = this._buildExplorer()
        this.sidebar = this._buildSidebar()
        this.appendChild(this.sidebar)
        this.appendChild(explorer)
    }

    _buildExplorer() {
        const explorer = document.createElement('div')
        explorer.setAttribute('id', 'explorer')
        const icon = this._buildExplorerIcon()
        explorer.appendChild(icon)
        explorer.addEventListener('click', () => {
            explorer.classList.add('selected')
            this._selectElement(explorer.id)
            this._changeVisibilityOfSidebar(String(explorer.id).toUpperCase())
        })
        this.elements.push(explorer)
        return explorer
    }

    _buildExplorerIcon() {
        const icon = document.createElement('img')
        icon.className = 'icon'
        icon.src = "./icons/explorer.png"
        icon.alt = 'Files explorer'
        return icon
    }

    /**
     * @param {String} idOfClickedElement 
     */
    _selectElement(idOfClickedElement) {
        this.elements.forEach((element) => {
            if (element.classList.contains("selected") && element.id != idOfClickedElement) {
                element.classList.remove('selected')
            }
        })
    }

    /**
     * 
     * @param {String} nameOfMenuOption 
     */
    _changeVisibilityOfSidebar(nameOfMenuOption) {
        if (this.sidebar.className == "hidden")
            this.sidebar.className = "sidebar"
        else this.sidebar.className = "hidden"
        this.sidebar.dispatchEvent(new Event('visibilityChanged'))
        this.sidebarTitle = nameOfMenuOption
    }

    _buildSidebar() {
        const sidebar = document.createElement('div')
        sidebar.className = 'hidden'
        sidebar.setAttribute('id', 'sidebar')
        const resizeDragger = this._buildResizeDragger()
        const sidebarContent = this._buildContentOfSidebar()
        sidebar.appendChild(sidebarContent)
        sidebar.appendChild(resizeDragger)
        return sidebar
    }

    _buildContentOfSidebar() {
        const sidebarContent = document.createElement('div')
        sidebarContent.className = 'sidebar-content'
        const header = this._buildHeaderOfExplorer()
        const indexJs = this._buildFileIndexJs()
        const appJS = this._buildFileAppJs()
        sidebarContent.appendChild(header)
        sidebarContent.appendChild(indexJs)
        sidebarContent.appendChild(appJS)
        return sidebarContent
    }

    _buildHeaderOfExplorer() {
        const header = document.createElement('div')
        header.className = 'sidebar-header'
        const title = this._buildTitle()
        header.appendChild(title)
        return header
    }

    _buildTitle() {
        const title = document.createElement('p')
        title.textContent = 'EXPLORER'
        title.id = 'sidebar-title'
        this.sidebarTitle = title
        return title
    }

    _buildFileIndexJs() {
        const file = document.createElement('div')
        file.className = 'file'
        file.id = 'index-js'
        file.addEventListener('click', () => {
            this.screen.dispatchEvent(new CustomEvent(
                "runFile", {
                "detail": { 'fileName': 'index.js' }
            }
            ))
        })
        const fileName = this._buildFileNameInfexJS()
        file.appendChild(fileName)
        return file
    }

    _buildFileNameInfexJS() {
        const fileName = document.createElement('p')
        fileName.className = 'file-name'
        fileName.textContent = 'index.js'
        return fileName
    }

    _buildFileAppJs() {
        const file = document.createElement('div')
        file.className = 'file'
        file.id = 'app-js'
        file.addEventListener('click', () => {
            this.screen.dispatchEvent(new CustomEvent(
                "runFile", {
                "detail": { 'fileName': 'app.js' }
            }
            ))
        })
        const fileName = this._buildFileNameAppJS()
        file.appendChild(fileName)
        return file
    }

    _buildFileNameAppJS() {
        const fileName = document.createElement('p')
        fileName.className = 'file-name'
        fileName.textContent = 'app.js'
        return fileName
    }

    _buildResizeDragger() {
        const resizeDragger = document.createElement('div')
        resizeDragger.id = 'resize-dragger'
        return resizeDragger
    }
}

customElements.define('custom-menu-container', CustomMenuContainer)