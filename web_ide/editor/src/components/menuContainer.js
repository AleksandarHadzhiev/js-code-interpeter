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
        sidebarContent.setAttribute('id', 'sidebar-content')
        const header = this._buildHeaderOfExplorer()
        const projectSelector = this._buildProjectSelector()
        sidebarContent.appendChild(header)
        sidebarContent.appendChild(projectSelector)
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

    _buildProjectSelector() {
        const projectSelector = document.createElement('div')
        projectSelector.style = `
        width: 100%; 
        height: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;`
        const openProjectButton = this._buildOpenProjectButton()
        const createProjectButton = this._buildCreateProjectButton()
        projectSelector.appendChild(openProjectButton)
        projectSelector.appendChild(createProjectButton)
        return projectSelector
    }

    _buildOpenProjectButton() {
        const openProject = document.createElement('button')
        openProject.className = 'project-button'
        openProject.textContent = 'Open Project'
        return openProject
    }

    _buildCreateProjectButton() {
        const createProject = document.createElement('button')
        createProject.className = 'project-button'
        createProject.textContent = 'Create Project'
        return createProject
    }

    _buildResizeDragger() {
        const resizeDragger = document.createElement('div')
        resizeDragger.id = 'resize-dragger'
        return resizeDragger
    }
}

customElements.define('custom-menu-container', CustomMenuContainer)