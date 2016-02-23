/* global describe it */

import chai from 'chai'
import {markyupdate, markychange, markyfocus, markyblur, markyselect} from '../src/modules/custom-events'

chai.should()

describe('custom events', () => {
  it('creates an update event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyupdate', function () {
      dispatched++
    })
    editor.dispatchEvent(markyupdate)

    dispatched.should.equal(1)
  })
  it('creates a markychange event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markychange', function () {
      dispatched++
    })
    editor.dispatchEvent(markychange)

    dispatched.should.equal(1)
  })
  it('creates a markyfocus event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyfocus', function () {
      dispatched++
    })
    editor.dispatchEvent(markyfocus)

    dispatched.should.equal(1)
  })
  it('creates a markyblur event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyblur', function () {
      dispatched++
    })
    editor.dispatchEvent(markyblur)

    dispatched.should.equal(1)
  })
  it('creates a markyselect event', () => {
    const editor = document.querySelector('.marky-editor')
    let dispatched = 0
    editor.addEventListener('markyselect', function () {
      dispatched++
    })
    editor.dispatchEvent(markyselect)

    dispatched.should.equal(1)
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

    dispatched.should.equal(1)
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

    dispatched.should.equal(1)
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

    dispatched.should.equal(1)
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

    dispatched.should.equal(1)
  })
})
