class CustomMenuContainer extends HTMLElement {
    constructor() {
        super()
        this.elements = []
        const explorer = this._buildExplorer()
        this.sidebar = this._buildSidebar()
        this.appendChild(this.sidebar)
        this.appendChild(explorer)
    }

    _buildSidebar() {
        const sidebar = document.createElement('div')
        sidebar.className = 'hidden'
        sidebar.setAttribute('id', 'sidebar')
        return sidebar
    }

    _buildExplorer() {
        const explorer = document.createElement('div')
        explorer.setAttribute('id', 'explorer')
        const icon = this._buildExplorerIcon()
        explorer.appendChild(icon)
        explorer.addEventListener('click', () => {
            explorer.classList.add('selected')
            this.elements.forEach((element) => {
                if (element.classList.contains("selected") && element.id != 'explorer') {
                    element.classList.remove('selected')
                }
            })

            if (this.sidebar.className == "hidden")
                this.sidebar.className = "sidebar"
            else this.sidebar.className = "hidden"
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
}

customElements.define('custom-menu-container', CustomMenuContainer)