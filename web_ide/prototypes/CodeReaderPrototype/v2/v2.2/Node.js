export default class Node {
    constructor(content) {
        this.content = content // For now only line, but soon to be words as well.
        this.next = null;
        this.prev = null;
    }
}