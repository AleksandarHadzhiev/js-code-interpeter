export default class Word {
    constructor(content) {
        this.content = content
        this.scope = null
        this.firstAppearance = null
        this.type = null;
    }

    udateType(type) {
        this.type = type
    }

    updateFirstAppearance(first) {
        this.firstAppearance = first
    }

    updateScope(scope) {
        this.scope = scope
    }
}