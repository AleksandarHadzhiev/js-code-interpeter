import sheet from './prototype.css' with { type: 'css' };
import LoadStylesFromCSS from './loadStylesFromCSS.js';

const loader = new LoadStylesFromCSS(sheet.rules)
const classes = loader.getClasses()

class custonNavigatio extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const container = this.buildContainer();
        shadowRoot.append(container)
    }

    buildContainer() {
        const container = document.createElement('div')
        container.style = `${classes.navigation}`
        return container
    }
}

customElements.define('custom-navigation', custonNavigatio)