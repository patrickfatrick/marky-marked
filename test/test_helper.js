import mark from '../src/modules/mark'

const container = document.createElement('marky-mark')
const anotherContainer = document.createElement('funky-bunch') // used for a few tests in mark-test.js
const yetAnotherContainer = document.createElement('marky-mark') // used for a test in mark-test.js
document.body.appendChild(container)
document.body.appendChild(anotherContainer)
document.body.appendChild(yetAnotherContainer)
mark()
