import { textToWorkWith, shortText } from "../../../textToWorkWith.js"

const listOfPossibleLinesToDisplay = textToWorkWith.split('\n')
export default class Line {

    constructor(index) {
        this.index = index
        console.log(index)
        this.content = this.getLineContent(index)
        this.numeration = this.getLineNumerationBasedOnIndexInLoop(index)
    }

    getLineContent(index) {
        if (index >= listOfPossibleLinesToDisplay.length)
            return ""
        return listOfPossibleLinesToDisplay[index]
    }

    getLineNumerationBasedOnIndexInLoop(index) {
        return String(index + 1)
    }
}
