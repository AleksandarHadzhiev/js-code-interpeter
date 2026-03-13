class CusomHorizontal extends HTMLElement {
    constructor() {
        super()
        this.contentElement = document.getElementById('editor')
        this.buildBar()
    }

    changeVisibilityBasedOnWidth() {
        console.log(this.contentElement)
        console.log(this.contentElement.scrollWidth, this.contentElement.offsetWidth)
        if (this.contentElement.scrollWidth - this.contentElement.offsetWidth > 0) {
            console.log("HERE")
            this.classList.remove('invisible')
            this.classList.add('horizontal-scrollbar')
        }
        else {
            this.classList.add('invisible')
            this.classList.remove('horizontal-scrollbar')
        }
    }

    scrollHorizontally() {
        console.log("HERE")
        if (this.classList.contains('horizontal-scrollbar')) {
            const bar = this.childNodes[0]
            const marginLeft = this._calculateMargintLeft()
            console.log(marginLeft)
            bar.style.marginLeft = `${marginLeft}px`
        }
    }

    _calculateMargintLeft() {
        const totalWidth = this.offsetWidth
        console.log(this.contentElement.scrollLeft)
        console.log(totalWidth)
        const percentageToScroll = this._calculatePercentageToScroll()
        console.log(percentageToScroll)
        const decimal = (percentageToScroll / 100)
        console.log(decimal)
        return (decimal * totalWidth)
    }

    _calculatePercentageToScroll() {
        const heightOFBar = this._calculateWidthOfBar()
        const scrolledFromcontentElement = this.contentElement.scrollLeft
        const totalPositionForScrolling = (this.contentElement.scrollWidth - this.contentElement.offsetWidth + heightOFBar)
        return (scrolledFromcontentElement / totalPositionForScrolling) * 100;
    }

    _calculateWidthOfBar() {
        const bar = this.childNodes[0]
        const totalWidth = this.offsetWidth
        const widthOfBarAsPercentage = ((bar.offsetWidth / totalWidth) * 100) + 1.5
        return (widthOfBarAsPercentage / 100) * this.contentElement.scrollLeft
    }

    buildBar() {
        const bar = document.createElement('div')
        bar.classList.add('bar')
        bar.classList.add('horizontal-bar')
        this.appendChild(bar)
    }
}

customElements.define('custom-horizontal', CusomHorizontal)