// import FrontendBuilder from "./v2.1/frontend/FrontendBuilder.js"
// import Builder from "./v2.2/Builder.js"
import FrontendBuilder from "./v2.3/frontend/FrontendBuilder.js";

export default class ProgramRunner {
    constructor(reader) {
        // The runner should work with both frontned and backend actions
        // To do that it will give the responsibility to two smaller components
        // FrontendBuilder
        // BackendBuilder
        // The ProgramRunner will receive the content it should work with and the reader
        // The content is the text from the textarea
        // the reader is the `pre` HTMLElement which is the view.
        // this.frontendBuilder = new FrontendBuilder() // pass the reader at a later stage
        // this.backendBuilder = null // integrate when class is received
        this.builder = new FrontendBuilder();
    }

    buildLinesForContent(content) {
        this.builder.buildLinesForContent(content)
    }

}