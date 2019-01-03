import marked from 'marked';

export default class Store {
  constructor(timeline = []) {
    this.timeline = timeline;
    this.index = 0;
  }

  get state() {
    return this.timeline[this.index];
  }

  get html() {
    return this.state.html;
  }

  get markdown() {
    return this.state.markdown;
  }

  get selection() {
    return this.state.selection;
  }

  /**
   * Handles adding and removing state
   * @param   {Object}   newState   the new state to push
   */
  push(newState) {
    this.timeline = this.timeline.slice(0, this.index + 1);
    this.timeline.push(newState);
    this.index += 1;
    if (this.index > 999) {
      this.timeline.shift();
      this.index -= 1;
    }
  }

  /**
   * updates the state
   * @external marked
   * @param   {String}    markdown   markdown blob
   * @param   {Number[]}  selection  selectionStart and selectionEnd indices
   */
  update(markdown, selection) {
    const html = marked(markdown, { sanitize: true }).toString() || '';

    this.push({ markdown, html, selection });
  }

  /**
   * moves backward in state
   * @param   {Number} num  the number of states to move back by
   */
  undo(num) {
    this.index = (this.index > (num - 1))
      ? this.index - num
      : 0;
  }

  /**
   * moves forwardin state
   * @param   {Number} num  the number of states to move forward by
   */
  redo(num) {
    this.index = (this.index < this.timeline.length - (num + 1))
      ? this.index + num
      : this.timeline.length - 1;
  }
}
