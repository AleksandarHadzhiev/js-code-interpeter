export default class SidebarResizer {
    /**
     * 
     * @param {Number} defaultMenuWidth 
     * @param {Number} minRequiredSidebarWidthForVisibility  
    */
    constructor(defaultMenuWidth, minRequiredSidebarWidthForVisibility) {
        this.defaultMenuWidth = defaultMenuWidth
        this.minRequiredSidebarWidthForVisibility = minRequiredSidebarWidthForVisibility
        this.sidebar = document.getElementById('sidebar')
    }

    /**
     * 
     * @param {Number} width 
     */
    updateProportions(width) {
        if (width < this.minRequiredSidebarWidthForVisibility)
            this.sidebar.className = 'hidden'
        else {
            this.sidebar.className = 'sidebar'
            this.sidebar.style = `width: ${width}px;`
        }
    }
}