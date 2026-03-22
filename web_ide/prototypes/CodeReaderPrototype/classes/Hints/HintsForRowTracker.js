import HintTypes from "./HintTypes.js";

export default class HintsForRowTracker {
    constructor() {
        this.problems = []
        this.currentHintIndex = 0;
    }

    addHint(hint) {
        const hintAlreadyExists = this._checkIfSpecifiedHintAlreadyExists(hint)
        if (!hintAlreadyExists)
            this._pushSpecifiedHintBasedOnType(hint)
        this.currentHintIndex = this.problems.length - 1
        return this
    }

    _checkIfSpecifiedHintAlreadyExists(hint) {
        let exists = false;
        this.problems.forEach(_hint => {
            if (_hint.message === hint.message)
                exists = true
        });
        return exists
    }

    _pushSpecifiedHintBasedOnType(hint) {
        if (hint.type === new HintTypes().ERROR)
            this.problems.unshift(hint)
        else this.problems.push(hint)
    }

    updateHintAtSpecifiedIndex(index) {
        this.problems.forEach((_hint, _index) => {
            if (_index === index) {
                _hint.switchDisplaySettings()
                this.problems[index] = _hint
            }
        });
        return this
    }

    updateHintMatchingSpecifiedMessage(message) {
        this.problems.forEach((_hint, index) => {
            if (_hint.message === message) {
                _hint.switchDisplaySettings()
                this.problems[index] = _hint
            }
        });
        return this
    }

    updateHintMatchingSpecifiedMessageToSpecificMode(message, mode) {
        this.problems.forEach((_hint, index) => {
            if (_hint.message === message) {
                _hint.changeDisplaySettingsToMode(mode)
                this.problems[index] = _hint
            }
        });
        return this
    }

    getCurrentHint() {
        return this.problems[this.currentHintIndex];
    }

    moveUpTheHints() {
        if (this.currentHintIndex === this.problems.length - 1) {
            this.currentHintIndex = 0;
        }
        else {
            this.currentHintIndex += 1;
        }

    }

    moveDownTheHints() {
        if (this.currentHintIndex === 0) {
            this.currentHintIndex = this.problems.length - 1;
        }
        else {
            this.currentHintIndex -= 1;
        }
    }

    getPositionInformation() {
        return `${this.currentHintIndex + 1} : ${this.problems.length}`
    }
}