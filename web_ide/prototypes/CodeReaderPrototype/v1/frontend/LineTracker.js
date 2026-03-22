export default class LineTrackerForFrontend {
    constructor() {
        this.lines = new Map()
    }

    addLine(line) {
        this.lines.set(line.id, line)
    }

    removeLineForId(id) {
        this.lines.delete(id)
    }

    getLineForId(id) {
        return this.lines.get(id)
    }

    getAllLines() {
        return this.lines
    }
}