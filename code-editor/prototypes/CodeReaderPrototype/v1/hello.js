const esprima = require('esprima');
const fs = require('fs');

const content = `

const age = 21;
age = 42;
const name = "Aleks";

if (age == 21) { console.log("OF AGE")}
else { conosle.log("NOT OF AGE") }

class Person {

    constructor(age, name){
        this.age = age;
        this.name = name;
    }

    getAge()
    {
        return this.age;
    }

    getName() {
        if (this.name === "Aleks") 
        {
            return this.name;
        }
        else { return "Not important" }
    }
}

if (something)


    console.log("Meow")


else (anything)


    console.log("Peow")



const person = new Person(age, name);
console.log(person.getAge());

const user = {
    name: person.getName()
    age: person.getAge();
}

function addTwoNumbers(a, b)


{

}

if (something) {
    pesho
}`

const lines = content.split('\n')
lines.forEach((line, index) => {
    try {
        esprima.parseScript(line)
        console.log(line)
    }
    catch (e) {
        const errorMEssage = e.message.replace('Line 1: ', '')
        console.log(errorMEssage)
        console.log(`Syntax error on line ${index + 1}: ${errorMEssage}`)
    }
});


const { ESLint } = require("eslint");

(async function main() {
    const eslint = new ESLint();

    const code = `
    var foo = 1
    console.log(foo)
  `;

    const results = await eslint.lintText(code);

    results.forEach(result => {
        result.messages.forEach(msg => {
            console.log(`${msg.line}:${msg.column} ${msg.message} (${msg.ruleId})`);
        });
    });
})();
