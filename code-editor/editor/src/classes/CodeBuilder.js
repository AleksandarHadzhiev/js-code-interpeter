import LineBUilder from "./LineBuilder.js";

export default class CodeBuilder {
    constructor(viewBlock) {
        this.viewBlock = viewBlock
    }

    buildLines(lines) {
        for (let index = 0; index < lines.length; index++) {
            const content = lines[index];
            const lineBuilder = new LineBUilder(content)
            const lineElement = lineBuilder.buildLine()
            this.viewBlock.appendChild(lineElement)
        }
    }
}