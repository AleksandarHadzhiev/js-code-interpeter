export default class Word {
    constructor(value, color, type, lineId, index, line, equalTo) {
        this.value = value;
        this.color = color;
        this.type = type;
        this.lineId = lineId
        this.line = line
        this.firstAppearance = null
        this.id = `${this.lineId}-${index}`
        this.redirectToElementInCode = null
        this.scope = null
        this.equalTo = equalTo
    }

    updateEqualTo(equalTo) {
        this.equalTo = equalTo
    }

    updateRedirectToElementInCode(element) {
        if (this.redirectToElementInCode == null)
            this.redirectToElementInCode = element
    }

    updateScope(scope) {
        this.scope = scope
    }

    attachFirstAppearance(firstAppearance) {
        this.firstAppearance = firstAppearance
    }

}