export default class TextChangesTracker {
    constructor() {
        this.firstLineOfChange = 0;
        this.lastLineOfChange = 0;
        this.newFirstLineOfChange = 0;
    }

    defineTheFirstLineOfChange(index, content) {
        this.firstLineOfChange = this._defineLineOfChange(index, content)
    }

    defineTheLastLineOfChange(index, content) {
        this.lastLineOfChange = this._defineLineOfChange(index, content)
    }

    defineTheNewFirstLineOfChange(index, content) {
        this.newFirstLineOfChange = this._defineLineOfChange(index, content)
    }

    _defineLineOfChange(index, content) {
        let position = index
        if (index == 0)
            position = 1
        const substringed = String(content).substring(0, position);
        return substringed.split('\n').length
    }
}