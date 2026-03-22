class CusomVertical extends HTMLElement {
    constructor() {
        super()
        this.editor = document.getElementById('editor')
        this.buildBar()
    }

    changeVisibilityBasedOnHeight() {
        if (this.editor.scrollHeight - this.editor.offsetHeight > 0) {
            this.classList.remove('invisible')
            this.classList.add('vertical-scrollbar')
        }
        else {
            this.classList.add('invisible')
            this.classList.remove('vertical-scrollbar')
        }
    }

    scrollVertically() {
        if (this.classList.contains('vertical-scrollbar')) {
            const bar = this.childNodes[0]
            const marginTop = this._calculateMargintTop()
            console.log(marginTop)
            bar.style.marginTop = `${marginTop}px`
        }
    }

    _calculateMargintTop() {
        const totalHeight = this.offsetHeight
        const percentageToScroll = this._calculatePercentageToScroll()
        const decimal = (percentageToScroll / 100)
        return (decimal * totalHeight)
    }

    _calculatePercentageToScroll() {
        const heightOFBar = this._calculateHeightOfBar()
        const scrolledFromWriter = this.editor.scrollTop
        const totalPositionForScrolling = (this.editor.scrollHeight - this.editor.offsetHeight + heightOFBar)
        return (scrolledFromWriter / totalPositionForScrolling) * 100;
    }

    _calculateHeightOfBar() {
        const bar = this.childNodes[0]
        const totalHeight = this.offsetHeight
        const heightOfBarAsPercentage = ((bar.offsetHeight / totalHeight) * 100) + 1.5
        return (heightOfBarAsPercentage / 100) * this.editor.scrollTop
    }

    buildBar() {
        const bar = document.createElement('div')
        bar.classList.add('bar')
        bar.classList.add('vertical-bar')
        this.appendChild(bar)
    }
}

customElements.define('custom-vertical', CusomVertical)
