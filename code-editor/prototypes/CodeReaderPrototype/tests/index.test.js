const { CodeLine } = require('../classes/line.js')
test('create a line', () => {
    const line = new CodeLine(0, "if (age > 21)")
    expect(line.value).toBe("if (age > 21)");
    expect(line.id).toBe(0)
})