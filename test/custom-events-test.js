/* global describe it */

import { assert } from 'chai'
import { markyupdate, markychange, markyfocus, markyblur, markyselect } from '../src/modules/custom-events'

describe('custom events', () => {
  it('creates an update event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyupdate', function () {
      dispatched++
    })
    editor.dispatchEvent(markyupdate)

    assert.strictEqual(dispatched, 1)
  })
  it('creates a markychange event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markychange', function () {
      dispatched++
    })
    editor.dispatchEvent(markychange)

    assert.strictEqual(dispatched, 1)
  })
  it('creates a markyfocus event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyfocus', function () {
      dispatched++
    })
    editor.dispatchEvent(markyfocus)

    assert.strictEqual(dispatched, 1)
  })
  it('creates a markyblur event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyblur', function () {
      dispatched++
    })
    editor.dispatchEvent(markyblur)

    assert.strictEqual(dispatched, 1)
  })
  it('creates a markyselect event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyselect', function () {
      dispatched++
    })
    editor.dispatchEvent(markyselect)

    assert.strictEqual(dispatched, 1)
  })
  it('dispatches markyfocus on focus', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyfocus', function () {
      dispatched++
    })
    var focus
    focus = document.createEvent('HTMLEvents')
    focus.initEvent('focus', true, true, window)
    editor.dispatchEvent(focus)

    assert.strictEqual(dispatched, 1)
  })
  it('dispatches markyblur on blur', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyblur', function () {
      dispatched++
    })
    var blur
    blur = document.createEvent('HTMLEvents')
    blur.initEvent('blur', true, true, window)
    editor.dispatchEvent(blur)

    assert.strictEqual(dispatched, 1)
  })
  it('dispatches markyselect on select', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyselect', function () {
      dispatched++
    })
    var select
    select = document.createEvent('HTMLEvents')
    select.initEvent('select', true, true, window)
    editor.dispatchEvent(select)

    assert.strictEqual(dispatched, 1)
  })
  it('dispatches markychange on markyupdate', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markychange', function () {
      dispatched++
    })
    var markyupdate
    markyupdate = document.createEvent('HTMLEvents')
    markyupdate.initEvent('markyupdate', true, true, window)
    editor.dispatchEvent(markyupdate)

    assert.strictEqual(dispatched, 1)
  })
})
