class CusomVertical extends HTMLElement {
    constructor() {
        super()
        this.writer = document.getElementById('writer')
        this.buildBar()
        this.writer.addEventListener('input', () => {
            if (this.writer.scrollHeight - this.writer.offsetHeight > 0) {
                this.classList.remove('invisible')
                this.classList.add('vertical-scrollbar')
            }
            else if (this.writer.scrollHeight - this.writer.offsetHeight == 0 && this.classList.contains('vertical-scrollbar')) {
                this.classList.add('invisible')
                this.classList.remove('vertical-scrollbar')
            }
        })

        this.writer.addEventListener('scroll', () => {
            const bar = this.childNodes[0]
            const marginTop = this._calculateMargintTop()
            bar.style.marginTop = `${marginTop}px`
        })
    }

    _calculateMargintTop() {
        const totalHeight = this.offsetHeight
        const percentageToScroll = this._calculatePercentageToScroll()
        const decimal = (percentageToScroll / 100)
        return (decimal * totalHeight)
    }

    _calculatePercentageToScroll() {
        const heightOFBar = this._calculateHeightOfBar()
        const scrolledFromWriter = this.writer.scrollTop
        const totalPositionForScrolling = (this.writer.scrollHeight - this.writer.offsetHeight + heightOFBar)
        return (scrolledFromWriter / totalPositionForScrolling) * 100;
    }

    _calculateHeightOfBar() {
        const bar = this.childNodes[0]
        const totalHeight = this.offsetHeight
        const heightOfBarAsPercentage = ((bar.offsetHeight / totalHeight) * 100) + 1.5
        return (heightOfBarAsPercentage / 100) * this.writer.scrollTop
    }

    buildBar() {
        const bar = document.createElement('div')
        bar.classList.add('bar')
        bar.classList.add('vertical-bar')
        this.appendChild(bar)
    }
}

customElements.define('custom-vertical', CusomVertical)
