import Formater from "./Formater.js";

export default class FormatBuilder {
    constructor(reader) {
        this.reader = reader
        this.formater = new Formater(reader)
    }

    formatCodeForLines(lines) {
        lines.forEach((content, index) => {
            this.formater.buildLine({ content: content, id: index })
        });
    }

    formatCodeForWords(words) {
        this.formater.buildWords(words)
    }

    // formatCodeForLinesAfterIndex(lines, index) {
    //     while (index <= lines.size) {
    //         this._formatAtIndex(index, lines)
    //         index++
    //     }
    // }

    // _formatAtIndex(index, lines) {
    //     const line = lines.get(index)
    //     this.formater.buildLine(line)
    // }

}