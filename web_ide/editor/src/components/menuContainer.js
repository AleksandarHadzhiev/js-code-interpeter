class CustomMenuContainer extends HTMLElement {
    constructor() {
        super()
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
        const header = this._buildHeaderOfExplorer()
        sidebar.appendChild(header)
        return sidebar
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
}

customElements.define('custom-menu-container', CustomMenuContainer)