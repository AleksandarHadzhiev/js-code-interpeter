class customSidebar extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const sidebar = document.createElement('div')
        sidebar.style = `
            width: 100%;
            background-color: transparent;
            height: fit-content;
            font-size: 20px;
            padding-bottom: 5px;
        `
        shadowRoot.append(sidebar);
    }
}

customElements.define('custom-sidebar', customSidebar);