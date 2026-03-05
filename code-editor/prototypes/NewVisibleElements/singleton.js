export default class FullTextSingleton {
    constructor(wholeText = "") {
        if (!!FullTextSingleton.instance) {
            return FullTextSingleton.instance;
        }

        FullTextSingleton.instance = this;

        this.wholeText = String(wholeText);

        return this;
    }

    getWholeText() {
        return this.wholeText;
    }

    updateWholeText(newTextToAdd) {
        this.wholeText += newTextToAdd
    }
}