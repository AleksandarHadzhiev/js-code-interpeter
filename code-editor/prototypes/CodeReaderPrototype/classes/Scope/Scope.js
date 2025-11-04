
export default class Scope {
    constructor(type, id) {
        this.type = type;
        this.id = id;
        this.parent = null
        this.chilren = []
        this.lines = new Map()
        this.isCloded = false;
    }

    setParent(newParent) {
        this.parent = newParent
    }

    addNewLine(line) {
        this.lines.set(line.id, line)
    }

    removeLine(line) {
        this.lines.delete(line.id)
    }

    getLines() {
        const lines = []
        this.lines.forEach((line, key) => {
            lines.push(line)
        })
        return lines
    }

    getLastLine() {
        return this.lines.get(this.lines.size - 1)
    }

    closeScope() {
        this.isCloded = true;
    }

    addChild(scope) {
        this.chilren.push(scope)
    }
}