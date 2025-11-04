export default class LoadStylesFromCSS {
    constructor(cssClasses) {
        this.cssClasses = cssClasses
        this.classes = {}
        this.loadClasses()
    }

    loadClasses() {
        for (let index = 0; index < this.cssClasses.length; index++) {
            const rule = this.cssClasses[index];
            const styles = this.loadStyles(rule.cssText, rule.selectorText)
            const className = rule.selectorText
            this.classes[className.replace('.', '')] = styles
        }
    }

    loadStyles(styles, name) {
        let filteredStyles = styles
        if (styles.includes(name)) {
            filteredStyles = styles.replace(name, "")
            filteredStyles = filteredStyles.replace('{', "")
            filteredStyles = filteredStyles.replace('}', "")
        }
        return filteredStyles
    }

    getClasses() {
        return this.classes
    }
}