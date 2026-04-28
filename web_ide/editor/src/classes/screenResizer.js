import ScreenResizerObserver from "./screenResizerObserver.js"

export default class ScreenResizer {
    /**
     * 
     * @param {ScreenResizerObserver} screenResizerObserver 
     * @param {HTMLElement} screen 
     */
    constructor(screenResizerObserver, screen) {
        window.addEventListener('resize', () => {
            const width = screen.offsetWidth
            const height = screen.offsetHeight
            screenResizerObserver.notifyResizeListeners(width, height)
        })
    }
}