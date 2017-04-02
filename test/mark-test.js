/* global describe it */

import { assert } from 'chai'
import mark from '../src/modules/mark'

describe('mark', () => {
  it('creates a toolbar, a textarea, and a hidden input', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    assert.strictEqual(container.children[0].tagName.toLowerCase(), 'div')
    assert.propertyVal(container.children[0].classList, '0', 'marky-toolbar')
    assert.strictEqual(container.children[1].tagName.toLowerCase(), 'textarea')
    assert.propertyVal(container.children[1].classList, '0', 'marky-editor')
    assert.strictEqual(container.children[2].type, 'hidden')
    assert.propertyVal(container.children[2].classList, '0', 'marky-output')
  })
  it('creates a bunch of toolbar controls', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    assert.propertyVal(container.children[0].children[0].classList, '0', 'heading')
    assert.propertyVal(container.children[0].children[1].classList, '0', 'separator')
    assert.propertyVal(container.children[0].children[2].classList, '0', 'bold')
    assert.propertyVal(container.children[0].children[3].classList, '0', 'italic')
    assert.propertyVal(container.children[0].children[4].classList, '0', 'strikethrough')
    assert.propertyVal(container.children[0].children[5].classList, '0', 'code')
    assert.propertyVal(container.children[0].children[6].classList, '0', 'blockquote')
    assert.propertyVal(container.children[0].children[8].classList, '0', 'link')
    assert.propertyVal(container.children[0].children[9].classList, '0', 'image')
    assert.propertyVal(container.children[0].children[11].classList, '0', 'unordered-list')
    assert.propertyVal(container.children[0].children[12].classList, '0', 'ordered-list')
    assert.propertyVal(container.children[0].children[13].classList, '0', 'outdent')
    assert.propertyVal(container.children[0].children[14].classList, '0', 'indent')
    assert.propertyVal(container.children[0].children[16].classList, '0', 'undo')
    assert.propertyVal(container.children[0].children[17].classList, '0', 'redo')
    assert.propertyVal(container.children[0].children[19].classList, '0', 'fullscreen')
  })
  it('initializes on marky-mark elements by default', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const anotherContainer = document.getElementsByTagName('funky-bunch')[0]
    assert.isUndefined(anotherContainer.children[0])
    assert.strictEqual(container.children[0].tagName.toLowerCase(), 'div')
    assert.propertyVal(container.children[0].classList, '0', 'marky-toolbar')
    assert.strictEqual(container.children[1].tagName.toLowerCase(), 'textarea')
    assert.propertyVal(container.children[1].classList, '0', 'marky-editor')
    assert.strictEqual(container.children[2].type, 'hidden')
    assert.propertyVal(container.children[2].classList, '0', 'marky-output')
  })
  it('initializes on an array of empty elements passed in', () => {
    const container = document.createElement('mark-wahlberg')
    document.body.appendChild(container)

    assert.doesNotThrow(() => mark([container]), TypeError)

    document.body.removeChild(container)
  })
  it('initializes on a NodeList passed in', () => {
    const container = document.createElement('mark-wahlberg')
    document.body.appendChild(container)

    assert.doesNotThrow(() => mark(document.querySelectorAll('mark-wahlberg')), TypeError)

    document.body.removeChild(container)
  })
  it('initializes on an HTMLCollection passed in', () => {
    const container = document.createElement('mark-wahlberg')
    document.body.appendChild(container)

    assert.doesNotThrow(() => mark(document.getElementsByTagName('mark-wahlberg')), TypeError)

    document.body.removeChild(container)
  })
  it('throws a TypeError if an array or HTMLCollection is not passed in', () => {
    const container = document.createElement('mark-wahlberg')
    document.body.appendChild(container)

    assert.throws(() => mark(container), TypeError)

    document.body.removeChild(container)
  })
  it('throws a TypeError if an array of non-HTMLElements is passed in', () => {
    const containers = ['marky-mark', 'funky-bunch', 'mark-wahlberg']

    assert.throws(() => mark(containers), TypeError)
  })
  it('initializes on multiple elements', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const anotherContainer = document.getElementsByTagName('funky-bunch')[0]
    const yetAnotherContainer = document.getElementsByTagName('marky-mark')[1]
    assert.isUndefined(anotherContainer.children[0])
    assert.strictEqual(yetAnotherContainer.children[0].tagName.toLowerCase(), 'div')
    assert.propertyVal(yetAnotherContainer.children[0].classList, '0', 'marky-toolbar')
    assert.strictEqual(container.children[0].tagName.toLowerCase(), 'div')
    assert.propertyVal(container.children[0].classList, '0', 'marky-toolbar')
    assert.strictEqual(container.children[1].tagName.toLowerCase(), 'textarea')
    assert.propertyVal(container.children[1].classList, '0', 'marky-editor')
    assert.strictEqual(container.children[2].type, 'hidden')
    assert.propertyVal(container.children[2].classList, '0', 'marky-output')
  })
  it('checks that the element is empty', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const anotherContainer = document.createElement('marky-mark')

    document.body.appendChild(anotherContainer)
    mark()

    assert.lengthOf(container.children, 3)
    assert.lengthOf(anotherContainer.children, 3)
  })
})
