export default class Line {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }

    compareLineContentWithIncomingContentAndUpdateIfNeeded(line) {
        if (this.content !== line.content) {
            this.content = line.content
        }
    }
}