import ProgramRunner from "./v2/runner.js"
import LineNumberTracker from "./v2/v2.3/frontend/LineNumberTracker.js"
const reader = document.getElementById('reader-container')
const writer = document.getElementById('writer')
const writerContainer = document.getElementById('writer-container')
const lineTracker = document.getElementById('lines-tracker')
new LineNumberTracker([])
const programRunner = new ProgramRunner(reader)

window.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        writer.style.pointerEvents = 'none';
    }
})

window.addEventListener('keyup', (event) => {
    writer.style.pointerEvents = 'auto';
})

writer.addEventListener('input', (event) => {
    const content = event.target.value
    programRunner.buildLinesForContent(content)
})


writer.addEventListener('scroll', (event) => {
    writerContainer.scrollTop = writer.scrollTop
    reader.scrollTop = writer.scrollTop
    const content = event.target.value
    programRunner.buildLinesForContent(content)
})

// TESTING PURPOSES !!!

// class Age {

//     constructor(age) {
//         this.age = age;
//     }

//     getAge() {
//         return this.age;
//     }

//     setAge(newAge) {
//         this.age = newAge;
//     }

//     updateAge(age) {
//         this.age = age;
//     }

//     testAge() {
//         return this.getAge();
//     }
// }
