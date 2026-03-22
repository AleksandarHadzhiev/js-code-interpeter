// export default class Line {
//     constructor(content, id) {
//         this.id = id;
//         this.content = content;
//         this.next = null;
//         this.prev = null;
//     }


// }

export default class Line {
    constructor(content) {
        this.content = content;
    }

    updateContent(line) {
        if (line.content !== this.content) this.content = line.content
    }
}