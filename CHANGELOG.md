#### 4.0

More breaking changes! Yay! This update actually includes some big changes.

The biggest change is now the library exports just a function, `markymark`. Rather than `marky.mark()` you will just use `markymark()` to initialize it. 

In moving further away from the DOM for the public API, I've incorporated [contra/emitter](https://github.com/bevacqua/contra#λemitterthing-options) so that now the Marky object itself emits the public events ('markychange', 'markyupdate', etc.). No more having to register CustomEvents to be able to interface with the events.

This package also now uses Rollup for the build. This resulted in significantly a smaller library, even with the addition of the emitter. About 20KB was shaved off the minified file.

Tests are now written with Tape instead of Mocha/Chai, as well.

#### 3.0

Another breaking change was introduced. Instead of writing the html to a hidden input in the DOM it is now written to the marky object in the `html` prop. Similarly, the current state's markdown is written to the `markdown` prop.

Finally, fullscreen and the `fullscreen-toggled` class have been renamed. The concept of "fullscreen" is now called "expanded view" since it may only fill its container depending on your styles and layout. The class is now `marky-expanded`.

#### 2.0

Not much has really changed, but there is a breaking change in that now `mark` should have elements directly passed in, rather than tag names. To migrate you really only need to switch your function call from `mark('funky-bunch')` to `mark(document.getElementsByTagName('funcky-bunch'))`.

It accepts an array of elemtents, HTMLCollection, and NodeList. You cannot pass in an element directly; even if it's one element just wrap it in an array.

`marky-mark` elements still are initialized by default.

This change should make it a little more flexible and a little easier to work with in frameworks like React and Vue so you can now just pass in refs within your components.

#### v1.5

- Under the hood: Switched to standardjs
- New `destroy()` method for removing editors from the DOM if need be.

#### v1.4

State management is a lot smarter now. Instead of the previous behavior where a markyupdate event would fire on every input event (meaning, every time a character is added or removed), and undo/redos would just go back or forward 5 state, updates are now fired on the following events:

- period input
- comma input
- question mark input
- exclamation point input
- colon input
- semi-colon input
- back slash input
- forward slash input
- ampersand input
- vertical pipe input
- space input (but not a space directly following any of the above punctuation or another space)
- Deletion of a bulk selection (using the delete key)
- Any toolbar button is used (aside from undo, redo, and fullscreen)
- The editor's value is committed by uthe user, meaning focus has moved off of the editor
- Lastly, if there's ever more than a one-second pause 

This essentially makes all toolbar functionality push an update, but also any word input and deliberate deletion of more than one character.

The main reasoning behind this change is to make the editor more performant. Rather than constantly writing state with every little change Marky Marked can be a bit more selective. I haven't run any benchmarks but by watching stats on my computer I noticed a drastic reduction in processor power needing to be used.

The other added benefit is that now we have a lot more state that can be written, since we're writing state a lot less frequently.

#### v1.3.5

- Mostly clean up. Only potentially breaking change should be that I've changed the super generic id that's added to most elements from `editor-0` for instance to `marky-mark-0` (as an id for the container element, as a class for everything else).

#### v1.3.4

- Resizing is now turned off by default for the textarea in the stylesheet. This can be overridden, of course.

#### v1.3

- Fullscreen. Hitting the new fullscreen button in the toolbar will toggle `fullscreen-toggled` classes on the container as well as the editor. With this you can make the Marky Marked editor fill the entire browser window. Of course, the included stylesheet already handles it all for you, if you're using it.
- Link and image insertion now behaves a bit differently. If any text is selected in the editor this text will be autopopulated into the alt text or display text input in the dialog. Additionally, instead of always inserting the Markdown snippet after the selected text, Marky Marked will now replace the selected text with the snippet. Which makes more sense when allowing for the autopopulation.

#### v1.2

- Headings selection is no longer done in a `<select>` element, but is instead a dialog with a `<ul>`. This was done to make the experience easier to style and make it consistent between browsers. 
- The update event has been replaced with the more consistently named "markyupdate" event.
- Some work with accessibility.
- Bug fixes.