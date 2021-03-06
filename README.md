# Marky Marked

_A `<textarea>` so sweet you'll be feeling good vibrations._
[http://patrickfatrick.github.io/marky-marked/](http://patrickfatrick.github.io/marky-marked/)

[![Circle CI](https://circleci.com/gh/patrickfatrick/marky-marked.svg?style=shield)](https://circleci.com/gh/patrickfatrick/marky-marked)
[![codecov.io](https://codecov.io/github/patrickfatrick/marky-marked/coverage.svg?branch=master)](https://codecov.io/github/patrickfatrick/marky-marked?branch=master)

![Marky Marked](./images/marky-marked.png)

## What is it?

Marky Marked is a lightweight in-browser content editor combining Markdown with the typical WYSIWYG toolbar. The end result is an editor that rewards good Markdown usage but also allows a point and click editor for folks who either are new to Markdown, forget a specific formatting guideline, or just prefer using their mouse. Marky Marked's minified is less than 15KB minified and gzipped.

Because it's all Markdown the markup that comes out of it is well-formatted and easy to parse. One philosophical concern is that no style attributes are ever applied. All Marky Marked outputs is markup. Marky Marked also sanitizes the markup so you don't need to worry about HTML in the input.

On top of all of that because it's built with a quasi-immutable state tree Marky Marked comes with undo and redo (but see the caveat in the [undo/redo section](#undoredo) below).

Click the links here to learn more about [Markdown syntax](https://help.github.com/articles/markdown-basics/) and [Github Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/) (which Marky Marked uses).

## Dependencies & Support

Marky Marked has only the following dependencies:

- [marked](https://github.com/chjj/marked), which handles the heavylifting for the Markdown parsing.
- [contra/emitter](https://github.com/bevacqua/contra#λemitterthing-options)
- [harsh](https://github.com/patrickfatrick/harsh)
- Optional: [Font Awesome](http://fontawesome.io/), unless you want to roll your own icons.

Marky Marked is supported in all modern desktop browsers as well as IE11. In an effort to keep it lean, and given that January 2016 effectively marks the end of pre-11 IE, there won't really be much of an effort to make it compliant with earlier versions for the time being.

## Install

```bash
$ npm install marky-marked # or
$ yarn add marky-marked # or
$ jspm install npm:marky-marked # or
$ bower install marky-marked # or
$ git clone git:github.com/patrickfatrick/marky-marked.git
```

## Usage

The easiest way to instantiate an editor is to simply add a `<marky-mark />` container tag to your markup and then call `markymark()`.

```html
<marky-mark />
```

```javascript
import markymark from 'marky-marked'

markymark();
```

You can pass in an element directly.

```html
<funky-bunch />
```

```js
markymark(document.querySelector('funky-bunch'))
```

You can also use any elements provided as an array, NodeList, or HTMLCollection.

```html
<mark-wahlberg />

<script>
	markymark(document.getElementsByTagName('mark-wahlberg'));
</script>
```

From there Marky Marked should handle the rest. Note that the element you use should be empty. If it has any innerHTML Marky Marked will ignore it. This is to ensure you can't initialize the same element more than once.

You can add as many editors as you'd like to any page, as long as they all use the same container tag. Marky Marked will assign each container a random ID like `marky-mark-11i8zccso3`, `marky-mark-f51j91l9vr`, etc., and these ids are stored in Marky object that's returned in the `id` prop. Most of the new elements in the container's subtree are assigned a matching class.

## Returns

`markymark()` returns an array of marky instances that allow you to manipulate and access the state for each initialized marky mark container without having to touch the DOM again. If a single element is passed in to the function, then a single instance is returned.

## Styling

The repo comes with a stylesheet in `/dist` that will get you where you want to go. But you are of course welcome to handle your own styling.

If you do use the stylesheet that comes with, you will need to install [Font Awesome](http://fontawesome.io/) onto your site, or you will be without toolbar icons.

## Undo/Redo

Think of state as a snapshot of the data inside Marky Marked at any given time. Marky Marked stores up to 1000 states, after which it starts clearing out the oldest states as new states are created. So it's not infinite.

The undo/redo buttons advance or go back one step in the state timeline.

But if you undo to a previous state and then create a new state by typing or adding a format from the toolbar, the timeline erases those states after the one you went back to. Just like in most any file editor.

## Indent/Outdent

New to v1.1.0 are toolbar buttons for indenting and outdenting. These buttons will add and subtract four spaces to the start of each line selected (or remove all spaces at the start of the line in the case of an outdent on a line starting with fewer than four spaces).

## Inserting Links and Images

New to v1.1.0 is a set of a dialogs for inputs links and images as opposed to simply inserting a generic Markdown snippet. Now you are greeted with a basic dialog in which you can put in the URL and optionally the display text or alt text, depending on which button is clicked.

![Marky Marked Dialog](./images/marky-marked-dialog.png)

As of v1.3.0, if any text is selected in the editor the 'Display text' or 'Alt text' input in the dialog will be autopopulated with that text when calling the dialog. Upon inserting the link or image snippet, that selected text will be replaced with the snippet.

## Expanded view

New to v1.3.0 is the ability to use an expanded view of the editor, filling its container (or the entire screen). This is accomplished by toggling `marky-expanded` on the container and the editor (as well as the button itself), when the new Expand button is hit.

The included stylesheet handles the CSS changes already, but something like this should work, if you're not using the stylesheet.

```css
[id^="marky-mark-"].marky-expanded {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem;
  box-sizing: border-box;
  background: white; /* or whatever color scheme you're using */
  z-index: 1000;
}
.marky-editor.marky-expanded {
  width: 100%;
  height: 90%;
  box-shadow: rgba(0, 0, 0, 0.3) 0 19px 60px, rgba(0, 0, 0, 0.22) 0 15px 20px;
}
button.expand.marky-expanded {
	/* some styles to show the setting is toggled */
}
```

This is what I use in the demo site.

![Marky Marked Expanded View](./images/marky-marked-fullscreen.png)

## API

#### Accessing Markdown and HTML

At any given time in the state of the editor you can access both the markdown and the HTML by accessing the editor's `marky` property, or the returned marky instance from the `markymark()` function call.

```javascript
var markyMarked = markymark(element)
// OR:
var marky = element.marky;

var markdown = markyMarked.markdown;
var html = markyMarked.html;
```

You can also access the markdown and html at any point in the state history, since state is immutable:

```javascript
var index = 0;
var markdown = markyMarked.state[index].markdown;
var html = markyMarked.state[index].html;
```

#### Events

You can watch for a number of events from the marky instance.

```javascript
markyMarked.on('markychange', function () {
	// Do stuff;
});
```

Here's the list of possibilities


```javascript
markyupdate // Emitted when any forward-progress change happens to the state (not including undo/redo).
markychange // Emitted when any change happens to the state (including undo/redo).
markyfocus // Emitted whenever the editor gains focus.
markyblur // Emitted whenever the editor loses focus.
markyselect // Emitted whenever the text selection in the editor changes.
```

#### Formatting

The various toolbar controls are exposed for easy use, and with the exception of the heading method all follow the same guidelines and return the same thing.

```javascript
markyMarked.bold([0, 5]); // Takes an array of the starting and ending indices to apply the format to
markyMarked.bold(); // If no argument is passed the currently selected text is assumed
```

This will return the newly selected text after the formatting has been applied.

For the heading method you should also pass in the level of heading, 1 to toggle an `h1`, 2 for `h2`, etc.

```javascript
markyMarked.heading(1, [0, 5]); // Also takes an array for the text to apply the format to
markyMarked.heading(4); // If no second argument is passed the currently selected text is assumed
markyMarked.heading(); // Assumes 0, which removes all headings from the selected text
```

Again an array representing the new starting and ending position is returned.

New to v1.1.0 you can now programmatically insert link and image snippets like so,

```javascript
markyMarked.link([0, 0], 'http://github.com/patrickfatrick/marky-marked', 'Marky Marked');
markyMarked.image([0, 0], 'http://i.imgur.com/VlVsP.gif', 'Chuck Chardonnay');
```

As before the first argument is an array representing the selection to use. The second is the URL to the link or the image. The third argument is the display text in the case of `link()` and the alt text in the case of `image()`. This method returns the new selection.

The full list of formatting methods is

```javascript
heading()
bold()
italic()
strikethrough()
code()
blockquote()
link()
image()
unorderedList()
orderedList()
indent()
outdent()
```

**NOTE:** These methods behave exactly like the toolbar buttons. They do not always apply the formatting and instead act more like toggles, with the exception of `link()` and `image()` which always insert the relevant Markdown snippet.

#### Undo/Redo

You can manually undo and redo like so, optionally passing in the number of states to undo or redo by as an argument. If no argument is passed Marky Marked will default to 5 as if the button was pushed.

```javascript
markyMarked.undo(20);
markyMarked.redo(13);
```

The new state index will be returned.

#### Setting the selection

You can set the text selection in the editor like so, passing in an array for the start and end positions. If no argument is passed Marky Marked will default to [0, 0];

```javascript
markyMarked.setSelection([5, 7]);
```

This method returns the array that was passed in.

#### Expanding the selection

You can expand the current text selection forward or backward in the editor like so, passing in the number of characters to move. If no argument is passed Marky Marked will default to 0;

```javascript
markyMarked.expandSelectionForward(3);
markyMarked.expandSelectionBackward(20);
```

This method returns the new starting and ending positions for the selection as an array.

#### Moving the cursor

You can also move the cursor in the editor like so, passing in the number of characters to move. If no argument is passed Marky Marked will default to 0.

```javascript
markyMarked.moveCursorForward(3);
markyMarked.moveCursorBackward(20);
```

This method returns the new cursor position in the editor.

#### Destroying editors

This will completely remove the container element (meaning, the custom tag that was used to instantiate Marky Marked, `<marky-mark />`, including the toolbar, editor and the hidden input storing the HTML string) from the DOM along with all of its event listeners.

```javascript
markyMarked.destroy()
```

## Example setups

To see Marky Marked in use as a library in the global scope, just check out [the demo page](./index.html).

To see it working inside a component (in this case Vue, but would work very similarly for React), check out this component in one of my projects, [taskmastr](https://github.com/patrickfatrick/taskmastr/blob/master/src/components/tasks/task-components/Notes.vue) 

## Building & Testing

Marky Marked uses a combination of Karma, Mocha, and Chai for tests. To run the tests,

```bash
$ npm test
```

To lint and build the distribution files:

```bash
$ npm run build
```

## What's the plan?

- Ability to customize instances, particularly with some or all of marked's options.

## License

Marky Marked is freely distributable under the terms of the [MIT license](./LICENSE).

_Each Marky Marked release is linted with StandardJS and Stylelint; tested with Karma and Tape._
