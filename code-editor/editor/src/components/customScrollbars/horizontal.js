class CusomHorizontal extends HTMLElement {
    constructor() {
        super()
        this.writer = document.getElementById('writer')
        this.buildBar()
        this.writer.addEventListener('input', (event) => {
            if (this.writer.scrollWidth - this.writer.offsetWidth > 0) {
                this.classList.remove('invisible')
                this.classList.add('horizontal-scrollbar')
            }
        })

        this.writer.addEventListener('scroll', () => {
            const bar = this.childNodes[0]
            const marginLeft = this._calculateMargintLeft()
            bar.style.marginLeft = `${marginLeft}px`
        })

    }

    _calculateMargintLeft() {
        const totalWidth = this.offsetWidth
        const percentageToScroll = this._calculatePercentageToScroll()
        const decimal = (percentageToScroll / 100)
        return (decimal * totalWidth)
    }

    _calculatePercentageToScroll() {
        const heightOFBar = this._calculateWidthOfBar()
        const scrolledFromWriter = this.writer.scrollLeft
        const totalPositionForScrolling = (this.writer.scrollWidth - this.writer.offsetWidth + heightOFBar)
        return (scrolledFromWriter / totalPositionForScrolling) * 100;
    }

    _calculateWidthOfBar() {
        const bar = this.childNodes[0]
        const totalWidth = this.offsetWidth
        const widthOfBarAsPercentage = ((bar.offsetWidth / totalWidth) * 100) + 1.5
        return (widthOfBarAsPercentage / 100) * this.writer.scrollLeft
    }


    buildBar() {
        const bar = document.createElement('div')
        bar.classList.add('bar')
        bar.classList.add('horizontal-bar')
        this.appendChild(bar)
    }
}

customElements.define('custom-horizontal', CusomHorizontal)