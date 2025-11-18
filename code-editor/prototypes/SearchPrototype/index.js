const reader = document.getElementById('reader')
const highlighter = document.getElementById('highlight')

highlighter.style = reader.style

reader.addEventListener('input', (event) => {
    highlighter.innerHTML = event.target.value.replace(/\n/g, '<br>');
    highlighter.style = reader.style
})

reader.addEventListener('scroll', (event) => {
    highlighter.scrollTop = reader.scrollTop
    highlighter.scrollLeft = reader.scrollLeft
})

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == 'f' || event.key == "F") {
        event.preventDefault()
        console.log('SEARCHING FOR')
        const replacerText = `<span class="highlighted">${"c"}</span>`
        highlighter.innerHTML = highlighter.innerHTML.replaceAll('c', replacerText).replace(/\n/g, '<br>');
    }
})
