(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.marky = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-marked
 */

var _marky = require('./src/marky');

var _marky2 = _interopRequireDefault(_marky);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _marky2.default;

},{"./src/marky":3}],2:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Marky = require('./modules/Marky');

var marky = Object.create(_Marky.Marky);
marky.init();

exports.default = marky;

},{"./modules/Marky":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = undefined;

var _Element = require('./Element');

var _Icon = require('./Icon');

/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {Array}      iconClasses      classes to use for <i> elements
 */
var Button = exports.Button = Object.create(_Element.Element);
Button.init = function (title, id) {
  _Element.Element.init.call(this, 'button', title, id);
  this.addClass(this.title, this.id);
  this.assign('value', this.title);
  this.icon = Object.create(_Icon.Icon);

  for (var _len = arguments.length, iconClasses = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    iconClasses[_key - 2] = arguments[_key];
  }

  this.icon.init(iconClasses);
  this.icon.appendTo(this.element);
};

},{"./Element":6,"./Icon":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingDialog = exports.ImageDialog = exports.LinkDialog = undefined;

var _Element = require('./Element');

var _ListItems = require('./ListItems');

/**
 * Creates dialog (modal) elements
 * @type {Element}
 * @requires  HeadingItem
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
var LinkDialog = exports.LinkDialog = Object.create(_Element.Element);
LinkDialog.init = function (title, id) {
  _Element.Element.init.call(this, 'div', title, id);
  this.addClass(this.title, id, 'dialog');

  LinkDialog.linkForm = Object.create(_Element.Element);
  this.linkForm.init('form', 'Link Form');
  this.linkForm.assign('id', this.id + '-link-form');

  this.linkUrlInput = Object.create(_Element.Element);
  this.linkUrlInput.init('input', 'Link Url');
  this.linkUrlInput.addClass('link-url-input');
  this.linkUrlInput.assign('type', 'text');
  this.linkUrlInput.assign('name', this.id + '-link-url-input');
  this.linkUrlInput.assign('placeholder', 'http://url.com');

  this.linkDisplayInput = Object.create(_Element.Element);
  this.linkDisplayInput.init('input', 'Link Display');
  this.linkDisplayInput.addClass('link-display-input');
  this.linkDisplayInput.assign('type', 'text');
  this.linkDisplayInput.assign('name', this.id + '-link-display-input');
  this.linkDisplayInput.assign('placeholder', 'Display text');

  this.insertButton = Object.create(_Element.Element);
  this.insertButton.init('button', 'Insert Link');
  this.insertButton.addClass('insert-link');
  this.insertButton.assign('textContent', 'Insert');

  this.linkUrlInput.appendTo(this.linkForm.element);
  this.linkDisplayInput.appendTo(this.linkForm.element);
  this.insertButton.appendTo(this.linkForm.element);
  this.linkForm.appendTo(this.element);
};

var ImageDialog = exports.ImageDialog = Object.create(_Element.Element);
ImageDialog.init = function (title, id) {
  _Element.Element.init.call(this, 'div', title, id);
  this.addClass(this.title, id, 'dialog');

  ImageDialog.imageForm = Object.create(_Element.Element);
  this.imageForm.init('form', 'Image Form');
  this.imageForm.assign('id', this.id + '-image-form');

  this.imageSourceInput = Object.create(_Element.Element);
  this.imageSourceInput.init('input', 'Image Source');
  this.imageSourceInput.addClass('image-source-input');
  this.imageSourceInput.assign('type', 'text');
  this.imageSourceInput.assign('name', this.id + '-image-source-input');
  this.imageSourceInput.assign('placeholder', 'http://url.com/image.jpg');

  this.imageAltInput = Object.create(_Element.Element);
  this.imageAltInput.init('input', 'Image Alt');
  this.imageAltInput.addClass('image-alt-input');
  this.imageAltInput.assign('type', 'text');
  this.imageAltInput.assign('name', this.id + '-image-alt-input');
  this.imageAltInput.assign('placeholder', 'Alt text');

  this.insertButton = Object.create(_Element.Element);
  this.insertButton.init('button', 'Insert Image');
  this.insertButton.addClass('insert-image');
  this.insertButton.assign('textContent', 'Insert');

  this.imageSourceInput.appendTo(this.imageForm.element);
  this.imageAltInput.appendTo(this.imageForm.element);
  this.insertButton.appendTo(this.imageForm.element);
  this.imageForm.appendTo(this.element);
};

var HeadingDialog = exports.HeadingDialog = Object.create(_Element.Element);
HeadingDialog.init = function (title, id) {
  var _this = this;

  _Element.Element.init.call(this, 'div', title, id);
  this.addClass(this.title, id, 'dialog');

  this.headingList = Object.create(_Element.Element);
  this.headingList.init('ul', 'Heading List');
  this.headingList.assign('id', id + '-heading-list');

  this.options = [];

  for (var i = 0; i < 6; i++) {
    var option = Object.create(_ListItems.HeadingItem);
    option.init('Heading ' + (i + 1), i + 1);
    this.options.push(option);
  }

  var remove = Object.create(_ListItems.HeadingItem);
  remove.init('Remove Heading', '0', 'fa', 'fa-remove');
  this.options.push(remove);

  this.options.forEach(function (option) {
    option.appendTo(_this.headingList.element);
  });

  this.headingList.appendTo(this.element);
};

},{"./Element":6,"./ListItems":8}],6:[function(require,module,exports){
'use strict';

/**
 * Creates an HTML element with some built-in shortcut methods
 * @param {String}      type    tag name for the element
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Element = exports.Element = {
  init: function init(type) {
    var title = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    this.type = type;
    this.title = title;
    this.id = id;
    this.element = this.register();
    if (this.title) this.element.title = this.title;
  },
  register: function register() {
    return document.createElement(this.type);
  },
  assign: function assign(prop, value) {
    this.element[prop] = value;
  },
  appendTo: function appendTo(container) {
    container.appendChild(this.element);
  },
  addClass: function addClass() {
    var _this = this;

    for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
      classNames[_key] = arguments[_key];
    }

    classNames.forEach(function (className) {
      _this.element.classList.add(className.replace(/[ ]/g, '-').toLowerCase());
    });
  },
  removeClass: function removeClass() {
    var _this2 = this;

    for (var _len2 = arguments.length, classNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      classNames[_key2] = arguments[_key2];
    }

    classNames.forEach(function (className) {
      _this2.element.classList.remove(className.replace(/[ ]/g, '-').toLowerCase());
    });
  },
  listen: function listen(evt, cb) {
    this.element.addEventListener(evt, cb);
  }
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = undefined;

var _Element = require('./Element');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Creates HTML i elements
 * @type {Element}
 * @param {Array} classNames classes to use with element
 */
var Icon = exports.Icon = Object.create(_Element.Element);
Icon.init = function (classNames) {
  _Element.Element.init.call(this, 'i');
  this.addClass.apply(this, _toConsumableArray(classNames));
};

},{"./Element":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingItem = undefined;

var _Element = require('./Element');

var _Icon = require('./Icon');

/**
 * Creates HTML option elements
 * @type {Element}
 * @requires  Icon
 * @param {String}  title   title for the element
 * @param {String}  value   a value to assign the element
 * @param {Array}  iconClasses    classes to use for <i> elements
 */
var HeadingItem = exports.HeadingItem = Object.create(_Element.Element);
HeadingItem.init = function (title, value) {
  _Element.Element.init.call(this, 'li', title);
  this.addClass(this.title.replace(' ', '-'));
  this.assign('value', value);

  this.button = Object.create(_Element.Element);
  this.button.init('button', title);
  this.button.assign('value', value);
  this.button.addClass('heading-button');
  this.button.appendTo(this.element);

  for (var _len = arguments.length, iconClasses = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    iconClasses[_key - 2] = arguments[_key];
  }

  if (iconClasses.length) {
    this.icon = Object.create(_Icon.Icon);
    this.icon.init(iconClasses);
    this.icon.appendTo(this.button.element);
  } else {
    this.button.assign('textContent', value);
  }
};

},{"./Element":6,"./Icon":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Marky = undefined;

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

var _dispatcher = require('./dispatcher');

var dispatcher = _interopRequireWildcard(_dispatcher);

var _customEvents = require('./custom-events');

var _handlers = require('./handlers');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Marky = exports.Marky = {
  init: function init(editor, container) {
    this.mark = _mark2.default;
    this.state = [{ markdown: '', html: '', selection: [0, 0] }];
    this.index = 0;
    this.editor = editor;
    this.container = container;
  },


  /**
   * Removes the container and all descendants from the DOM
   * @param  {container} container the container used to invoke `mark()`
   */
  destroy: function destroy() {
    var container = arguments.length <= 0 || arguments[0] === undefined ? this.container : arguments[0];

    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  },


  /**
   * Handles updating the state on forward-progress changes
   * @requires dispatcher/update
   * @param {String} markdown the new markdown blob
   * @param {Array}  state    the state timeline
   * @param {Number} index    current state index
   */
  update: function update(markdown) {
    var selection = arguments.length <= 1 || arguments[1] === undefined ? [0, 0] : arguments[1];
    var state = arguments.length <= 2 || arguments[2] === undefined ? this.state : arguments[2];
    var index = arguments.length <= 3 || arguments[3] === undefined ? this.index : arguments[3];
    var editor = arguments.length <= 4 || arguments[4] === undefined ? this.editor : arguments[4];

    var action = dispatcher.update(markdown, selection, state, index);
    this.state = action.state;
    this.index = action.index;
    editor.dispatchEvent(_customEvents.markychange);
    return this.index;
  },


  /**
   * Handles moving backward in state
   * @requires dispatcher/undo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  undo: function undo() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    var state = arguments.length <= 1 || arguments[1] === undefined ? this.state : arguments[1];
    var index = arguments.length <= 2 || arguments[2] === undefined ? this.index : arguments[2];
    var editor = arguments.length <= 3 || arguments[3] === undefined ? this.editor : arguments[3];

    if (index === 0) return index;

    var action = dispatcher.undo(num, state, index);
    this.index = action.index;
    editor.value = action.state.markdown;
    editor.setSelectionRange(action.state.selection[0], action.state.selection[1]);
    editor.nextSibling.value = action.state.html;
    editor.dispatchEvent(_customEvents.markychange);
    return this.index;
  },


  /**
   * Handles moving forward in state
   * @requires dispatcher/redo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  redo: function redo() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    var state = arguments.length <= 1 || arguments[1] === undefined ? this.state : arguments[1];
    var index = arguments.length <= 2 || arguments[2] === undefined ? this.index : arguments[2];
    var editor = arguments.length <= 3 || arguments[3] === undefined ? this.editor : arguments[3];

    if (index === state.length - 1) return index;

    var action = dispatcher.redo(num, state, index);
    this.index = action.index;
    editor.value = action.state.markdown;
    editor.setSelectionRange(action.state.selection[0], action.state.selection[1]);
    editor.nextSibling.value = action.state.html;
    editor.dispatchEvent(_customEvents.markychange);
    return this.index;
  },


  /**
   * Setsa the selection indices in the editor
   * @param   {Array}       arr    starting and ending indices
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the array that was passed in
   */
  setSelection: function setSelection() {
    var arr = arguments.length <= 0 || arguments[0] === undefined ? [0, 0] : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    editor.setSelectionRange(arr[0], arr[1]);
    return arr;
  },


  /**
   * expands the selection to the right
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */
  expandSelectionForward: function expandSelectionForward() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    var start = editor.selectionStart;
    var end = editor.selectionEnd + num;

    editor.setSelectionRange(start, end);
    return [start, end];
  },


  /**
   * expands the selection to the left
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */
  expandSelectionBackward: function expandSelectionBackward() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    var start = editor.selectionStart - num;
    var end = editor.selectionEnd;

    editor.setSelectionRange(start, end);
    return [start, end];
  },


  /**
   * expands the cursor to the right
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */
  moveCursorBackward: function moveCursorBackward() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    var start = editor.selectionStart - num;

    editor.setSelectionRange(start, start);
    return start;
  },


  /**
   * expands the cursor to the left
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */
  moveCursorForward: function moveCursorForward() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    var start = editor.selectionStart + num;

    editor.setSelectionRange(start, start);
    return start;
  },


  /**
   * implements a bold on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */
  bold: function bold(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var boldify = (0, _handlers.inlineHandler)(editor.value, indices, '**');
    editor.value = boldify.value;
    editor.setSelectionRange(boldify.range[0], boldify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [boldify.range[0], boldify.range[1]];
  },


  /**
   * implements an italic on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the italic
   */
  italic: function italic(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var italicize = (0, _handlers.inlineHandler)(editor.value, indices, '_');
    editor.value = italicize.value;
    editor.setSelectionRange(italicize.range[0], italicize.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [italicize.range[0], italicize.range[1]];
  },


  /**
   * implements a strikethrough on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the strikethrough
   */
  strikethrough: function strikethrough(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var strikitize = (0, _handlers.inlineHandler)(editor.value, indices, '~~');
    editor.value = strikitize.value;
    editor.setSelectionRange(strikitize.range[0], strikitize.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [strikitize.range[0], strikitize.range[1]];
  },


  /**
   * implements a code on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the code
   */
  code: function code(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var codify = (0, _handlers.inlineHandler)(editor.value, indices, '`');
    editor.value = codify.value;
    editor.setSelectionRange(codify.range[0], codify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [codify.range[0], codify.range[1]];
  },


  /**
   * implements a blockquote on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */
  blockquote: function blockquote(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var quotify = (0, _handlers.blockHandler)(editor.value, indices, '> ');
    editor.value = quotify.value;
    editor.setSelectionRange(quotify.range[0], quotify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [quotify.range[0], quotify.range[1]];
  },


  /**
   * implements a heading on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the heading
   */
  heading: function heading() {
    var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var indices = arguments[1];
    var editor = arguments.length <= 2 || arguments[2] === undefined ? this.editor : arguments[2];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var markArr = [];
    var mark = undefined;
    for (var i = 1; i <= value; i++) {
      markArr.push('#');
    }
    mark = markArr.join('');
    var space = mark ? ' ' : '';
    var headingify = (0, _handlers.blockHandler)(editor.value, indices, mark + space);
    editor.value = headingify.value;
    editor.setSelectionRange(headingify.range[0], headingify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [headingify.range[0], headingify.range[1]];
  },


  /**
   * inserts a link snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */
  link: function link(indices) {
    var url = arguments.length <= 1 || arguments[1] === undefined ? 'http://url.com' : arguments[1];
    var display = arguments.length <= 2 || arguments[2] === undefined ? 'http://url.com' : arguments[2];
    var editor = arguments.length <= 3 || arguments[3] === undefined ? this.editor : arguments[3];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var mark = '[' + display + '](' + url + ')';
    var linkify = (0, _handlers.insertHandler)(editor.value, indices, mark);
    editor.value = linkify.value;
    editor.setSelectionRange(linkify.range[0], linkify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [linkify.range[0], linkify.range[1]];
  },


  /**
   * inserts an image snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */
  image: function image(indices) {
    var source = arguments.length <= 1 || arguments[1] === undefined ? 'http://imagesource.com/image.jpg' : arguments[1];
    var alt = arguments.length <= 2 || arguments[2] === undefined ? 'http://imagesource.com/image.jpg' : arguments[2];
    var editor = arguments.length <= 3 || arguments[3] === undefined ? this.editor : arguments[3];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var mark = '![' + alt + '](' + source + ')';
    var imageify = (0, _handlers.insertHandler)(editor.value, indices, mark);
    editor.value = imageify.value;
    editor.setSelectionRange(imageify.range[0], imageify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [imageify.range[0], imageify.range[1]];
  },


  /**
   * implements an unordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */
  unorderedList: function unorderedList(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var listify = (0, _handlers.listHandler)(editor.value, indices, 'ul');
    editor.value = listify.value;
    editor.setSelectionRange(listify.range[0], listify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [listify.range[0], listify.range[1]];
  },


  /**
   * implements an ordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */
  orderedList: function orderedList(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var listify = (0, _handlers.listHandler)(editor.value, indices, 'ol');
    editor.value = listify.value;
    editor.setSelectionRange(listify.range[0], listify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [listify.range[0], listify.range[1]];
  },


  /**
   * implements an indent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the indent is implemented
   */
  indent: function indent(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var indentify = (0, _handlers.indentHandler)(editor.value, indices, 'in');
    editor.value = indentify.value;
    editor.setSelectionRange(indentify.range[0], indentify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [indentify.range[0], indentify.range[1]];
  },


  /**
   * implements an outdent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the outdent is implemented
   */
  outdent: function outdent(indices) {
    var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

    indices = indices || [editor.selectionStart, editor.selectionEnd];
    var indentify = (0, _handlers.indentHandler)(editor.value, indices, 'out');
    editor.value = indentify.value;
    editor.setSelectionRange(indentify.range[0], indentify.range[1]);
    var html = editor._marky.state[editor._marky.index].html;
    editor.nextSibling.value = html;
    editor.dispatchEvent(_customEvents.markyupdate);
    return [indentify.range[0], indentify.range[1]];
  }
};

},{"./custom-events":11,"./dispatcher":12,"./handlers":13,"./mark":14}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Separator = undefined;

var _Element = require('./Element');

/**
 * Create separator spans for the toolbar
 * @type {Element}
 */
var Separator = exports.Separator = Object.create(_Element.Element);
Separator.init = function () {
  _Element.Element.init.call(this, 'span');
  this.addClass('separator');
};

},{"./Element":6}],11:[function(require,module,exports){
/* global CustomEvent */
'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});


// Custom Event Polyfill for IE9+
(function () {
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var markyblur = exports.markyblur = new CustomEvent('markyblur');
var markyfocus = exports.markyfocus = new CustomEvent('markyfocus');
var markyselect = exports.markyselect = new CustomEvent('markyselect');
var markyupdate = exports.markyupdate = new CustomEvent('markyupdate');
var markychange = exports.markychange = new CustomEvent('markychange');

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;
exports.undo = undo;
exports.redo = redo;

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _pushState = require('./push-state');

var _pushState2 = _interopRequireDefault(_pushState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * updates the state
 * @external marked
 * @requires pushState
 * @param   {String} markdown   markdown blob
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
function update(markdown, selection, state, stateIndex) {
  var markedOptions = {
    sanitize: true
  };
  var html = (0, _marked2.default)(markdown, markedOptions).toString() || '';
  var newState = (0, _pushState2.default)(state, stateIndex, function () {
    return { markdown: markdown, html: html, selection: selection };
  });
  return newState;
}

/**
 * moves backward in state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
function undo(num, state, stateIndex) {
  stateIndex = stateIndex > num - 1 ? stateIndex - num : 0;
  return { state: state[stateIndex], index: stateIndex };
}

/**
 * moves forwardin state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
function redo(num, state, stateIndex) {
  stateIndex = stateIndex < state.length - (num + 1) ? stateIndex + num : state.length - 1;
  return { state: state[stateIndex], index: stateIndex };
}

},{"./push-state":16,"marked":2}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineHandler = inlineHandler;
exports.blockHandler = blockHandler;
exports.listHandler = listHandler;
exports.indentHandler = indentHandler;
exports.insertHandler = insertHandler;

var _parsers = require('./parsers');

/**
 * Handles wrapping format strings around a selection
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the format string to use
 * @returns {Object} the new string, the updated indices
 */
function inlineHandler(string, indices, mark) {
  var value = undefined;
  var useMark = [mark, mark];
  if (string.indexOf(mark) !== -1) {
    indices.forEach(function (n, i) {
      if (string.lastIndexOf(mark, n) === n - mark.length) {
        string = string.substring(0, n - mark.length) + string.substring(n, string.length);
        if (i === 0) {
          indices[0] = indices[0] - mark.length;
          indices[1] = indices[1] - mark.length;
        } else {
          indices[1] = indices[1] - mark.length;
        }
        if (i === 1 && useMark[0]) indices[1] = indices[1] + mark.length;
        useMark[i] = '';
      }
      if (string.indexOf(mark, n) === n) {
        string = string.substring(0, n) + string.substring(n + mark.length, string.length);
        if (i === 0 && indices[0] !== indices[1]) {
          indices[1] = indices[1] - mark.length;
        }
        if (i === 0 && indices[0] === indices[1]) {
          indices[0] = indices[0] - mark.length;
        }
        if (i === 1 && useMark[0]) indices[1] = indices[1] + mark.length;
        useMark[i] = '';
      }
    });
  }
  value = string.substring(0, indices[0]) + useMark[0] + string.substring(indices[0], indices[1]) + useMark[1] + string.substring(indices[1], string.length);
  return { value: value, range: [indices[0] + useMark[0].length, indices[1] + useMark[1].length] };
}

/**
 * Handles adding/removing a format string to a line
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the format string to use
 * @returns {Object} the new string, the updated indices
 */
function blockHandler(string, indices, mark) {
  var start = indices[0];
  var end = indices[1];
  var value = undefined;
  var lineStart = (0, _parsers.startOfLine)(string, start);
  var lineEnd = (0, _parsers.endOfLine)(string, end);
  if ((0, _parsers.indexOfMatch)(string, /^[#>]/m, lineStart) === lineStart) {
    var currentFormat = string.substring(lineStart, lineStart + string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm));
    value = string.substring(0, lineStart) + string.substring(lineStart + string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm), string.length);
    lineEnd = lineEnd - currentFormat.length;
    if (currentFormat.trim() !== mark.trim() && mark.trim().length) {
      value = string.substring(0, lineStart) + mark + string.substring(lineStart + string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm), string.length);
      lineStart = lineStart + mark.length;
      lineEnd = lineEnd + mark.length;
    }
    return { value: value, range: [lineStart, lineEnd] };
  }
  value = string.substring(0, lineStart) + mark + string.substring(lineStart, string.length);
  return { value: value, range: [start + mark.length, end + mark.length] };
}

/**
 * Handles adding/removing format strings to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} type    ul or ol
 * @returns {Object} the new string, the updated indices
 */
function listHandler(string, indices, type) {
  var start = (0, _parsers.startOfLine)(string, indices[0]);
  var end = (0, _parsers.endOfLine)(string, indices[1]);
  var lines = (0, _parsers.splitLines)(string.substring(start, end));
  var newLines = [];
  var value = undefined;
  lines.forEach(function (line, i) {
    var mark = type === 'ul' ? '-' + ' ' : i + 1 + '.' + ' ';
    var newLine = undefined;
    if ((0, _parsers.indexOfMatch)(line, /^[0-9#>-]/m, 0) === 0) {
      var currentFormat = line.substring(0, 0 + line.substring(0).search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm));
      newLine = line.substring(line.search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm), line.length);
      if (currentFormat.trim() !== mark.trim()) {
        newLine = mark + line.substring(line.search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm), line.length);
      }
      return newLines.push(newLine);
    }
    newLine = mark + line.substring(0, line.length);
    return newLines.push(newLine);
  });
  var joined = newLines.join('\r\n');
  value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
  return { value: value, range: [start, start + joined.replace(/\n/gm, '').length] };
}

/**
 * Handles adding/removing indentation to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} type    in or out
 * @returns {Object} the new string, the updated indices
 */
function indentHandler(string, indices, type) {
  var start = (0, _parsers.startOfLine)(string, indices[0]);
  var end = (0, _parsers.endOfLine)(string, indices[1]);
  var lines = (0, _parsers.splitLines)(string.substring(start, end));
  var newLines = [];
  var value = undefined;
  lines.forEach(function (line) {
    var mark = '    ';
    var newLine = undefined;
    if (type === 'out') {
      newLine = line.indexOf(mark, 0) === 0 ? line.substring(mark.length, line.length) : line.substring(line.search(/[~*`_[!#>-]|[a-zA-Z0-9]|\r|\n|$/gm), line.length);
      return newLines.push(newLine);
    }
    newLine = mark + line.substring(0, line.length);
    return newLines.push(newLine);
  });
  var joined = newLines.join('\r\n');
  value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
  return { value: value, range: [start, start + joined.replace(/\n/gm, '').length] };
}

/**
 * Handles inserting a snippet at the end of a selection
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the snippet to insert
 * @returns {Object} the new string, the updated indices
 */
function insertHandler(string, indices, mark) {
  var start = indices[0];
  var end = indices[1];
  var value = undefined;
  value = string.substring(0, start) + mark + string.substring(end, string.length);

  return { value: value, range: [start, start + mark.length] };
}

},{"./parsers":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var tag = arguments.length <= 0 || arguments[0] === undefined ? 'marky-mark' : arguments[0];

  var containers = document.getElementsByTagName(tag);
  var idArr = [];
  return Array.prototype.forEach.call(containers, function (container, i) {
    var idIndex = i;

    /**
     * Ignore container if it's not empty
     */
    if (container.children.length) {
      if (container.getAttribute('id')) idArr.push(parseInt(container.getAttribute('id').split('-')[2]));
      return;
    }

    /**
     * Create and register main elements:
     * toolbar, editor, dialog container, hidden input
     */

    var toolbar = Object.create(_Element.Element);
    toolbar.init('div', 'Toolbar');

    if (idArr.length) {
      idArr.sort();
      idIndex = idArr[idArr.length - 1] + 1;
    }

    var id = 'marky-mark-' + idIndex;
    container.id = id;
    toolbar.addClass('marky-toolbar', id);

    var dialogs = Object.create(_Element.Element);
    dialogs.init('div', 'Dialogs');
    dialogs.addClass('marky-dialogs', id);

    var markyEditor = Object.create(_Element.Element);
    markyEditor.init('textarea', 'Marky Marked Editor');
    markyEditor.addClass('marky-editor', id);

    var marky = Object.create(_Marky.Marky);
    marky.init(markyEditor.element, container);

    markyEditor.assign('_marky', marky);

    var markyOutput = Object.create(_Element.Element);
    markyOutput.init('input', 'Marky Marked Output');
    markyOutput.assign('type', 'hidden');
    markyOutput.addClass('marky-output', id);

    /**
     * Create and register dialogs and set listeners
     */

    function formSubmit(e) {
      e.preventDefault();
      markyEditor.element.focus();
    }

    var headingDialog = Object.create(_Dialogs.HeadingDialog);
    headingDialog.init('Heading Dialog', id);
    headingDialog.element.style.visibility = 'hidden';
    headingDialog.options.forEach(function (option) {
      option.listen('click', function (e) {
        e.preventDefault();
        var value = parseInt(e.target.value);
        markyEditor.element.focus();
        headingDialog.removeClass('toggled');
        headingDialog.element.style.visibility = 'hidden';
        markyEditor.element._marky.heading(value, [markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
      });
    });

    var linkDialog = Object.create(_Dialogs.LinkDialog);
    linkDialog.init('Link Dialog', id);
    linkDialog.element.style.visibility = 'hidden';
    linkDialog.linkForm.listen('submit', formSubmit);
    linkDialog.insertButton.listen('click', function (e) {
      e.preventDefault;
      markyEditor.element.focus();
      var url = linkDialog.linkUrlInput.element.value ? linkDialog.linkUrlInput.element.value : 'http://url.com';
      var display = linkDialog.linkDisplayInput.element.value ? linkDialog.linkDisplayInput.element.value : url;
      linkDialog.linkUrlInput.element.value = '';
      linkDialog.linkDisplayInput.element.value = '';
      linkDialog.element.style.visibility = 'hidden';
      linkDialog.removeClass('toggled');
      markyEditor.element._marky.link([markyEditor.element.selectionStart, markyEditor.element.selectionEnd], url, display);
    });

    var imageDialog = Object.create(_Dialogs.ImageDialog);
    imageDialog.init('Image Dialog', id);
    imageDialog.element.style.visibility = 'hidden';
    imageDialog.imageForm.listen('submit', formSubmit);
    imageDialog.insertButton.listen('click', function (e) {
      e.preventDefault;
      markyEditor.element.focus();
      var source = imageDialog.imageSourceInput.element.value ? imageDialog.imageSourceInput.element.value : 'http://imagesource.com/image.jpg';
      var alt = imageDialog.imageAltInput.element.value ? imageDialog.imageAltInput.element.value : source;
      imageDialog.imageSourceInput.element.value = '';
      imageDialog.imageAltInput.element.value = '';
      imageDialog.element.style.visibility = 'hidden';
      imageDialog.removeClass('toggled');
      markyEditor.element._marky.image([markyEditor.element.selectionStart, markyEditor.element.selectionEnd], source, alt);
    });

    /**
     * Create and register toolbar buttons and set listeners
     */

    function buttonMousedown(e) {
      e.preventDefault();
      e.currentTarget.classList.add('active');
      markyEditor.element.focus();
    }

    function buttonMouseup(e) {
      e.currentTarget.classList.remove('active');
    }

    var headingButton = Object.create(_Button.Button);
    headingButton.init('Heading', id, 'fa', 'fa-header');
    headingButton.dialog = headingDialog.element;
    headingButton.listen('click', function (e) {
      e.preventDefault();
      e.currentTarget.blur();
      headingButton.dialog.classList.toggle('toggled');
      imageDialog.element.style.visibility = 'hidden';
      imageDialog.removeClass('toggled');
      linkDialog.element.style.visibility = 'hidden';
      linkDialog.removeClass('toggled');
      if (headingButton.dialog.style.visibility === 'hidden') {
        headingButton.dialog.style.visibility = 'visible';
        return;
      }
      headingButton.dialog.style.visibility = 'hidden';
    });

    var boldButton = Object.create(_Button.Button);
    boldButton.init('Bold', id, 'fa', 'fa-bold');
    boldButton.listen('mousedown', buttonMousedown);
    boldButton.listen('mouseup', buttonMouseup);
    boldButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.bold([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var italicButton = Object.create(_Button.Button);
    italicButton.init('Italic', id, 'fa', 'fa-italic');
    italicButton.listen('mousedown', buttonMousedown);
    italicButton.listen('mouseup', buttonMouseup);
    italicButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.italic([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var strikethroughButton = Object.create(_Button.Button);
    strikethroughButton.init('Strikethrough', id, 'fa', 'fa-strikethrough');
    strikethroughButton.listen('mousedown', buttonMousedown);
    strikethroughButton.listen('mouseup', buttonMouseup);
    strikethroughButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.strikethrough([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var codeButton = Object.create(_Button.Button);
    codeButton.init('Code', id, 'fa', 'fa-code');
    codeButton.listen('mousedown', buttonMousedown);
    codeButton.listen('mouseup', buttonMouseup);
    codeButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.code([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var blockquoteButton = Object.create(_Button.Button);
    blockquoteButton.init('Blockquote', id, 'fa', 'fa-quote-right');
    blockquoteButton.listen('mousedown', buttonMousedown);
    blockquoteButton.listen('mouseup', buttonMouseup);
    blockquoteButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.blockquote([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var linkButton = Object.create(_Button.Button);
    linkButton.init('Link', id, 'fa', 'fa-link');
    linkButton.dialog = linkDialog.element;
    linkButton.listen('mousedown', buttonMousedown);
    linkButton.listen('mouseup', buttonMouseup);
    linkButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      linkButton.dialog.classList.toggle('toggled');
      imageDialog.element.style.visibility = 'hidden';
      imageDialog.removeClass('toggled');
      headingDialog.element.style.visibility = 'hidden';
      headingDialog.removeClass('toggled');
      if (linkButton.dialog.style.visibility === 'hidden') {
        linkButton.dialog.children[0].children[1].value = markyEditor.element.value.substring(markyEditor.element.selectionStart, markyEditor.element.selectionEnd);
        linkButton.dialog.style.visibility = 'visible';
        return;
      }
      linkButton.dialog.style.visibility = 'hidden';
    });

    var imageButton = Object.create(_Button.Button);
    imageButton.init('Image', id, 'fa', 'fa-file-image-o');
    imageButton.dialog = imageDialog.element;
    imageButton.listen('mousedown', buttonMousedown);
    imageButton.listen('mouseup', buttonMouseup);
    imageButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      imageButton.dialog.classList.toggle('toggled');
      linkDialog.element.style.visibility = 'hidden';
      linkDialog.removeClass('toggled');
      headingDialog.element.style.visibility = 'hidden';
      headingDialog.removeClass('toggled');
      if (imageButton.dialog.style.visibility === 'hidden') {
        imageButton.dialog.children[0].children[1].value = markyEditor.element.value.substring(markyEditor.element.selectionStart, markyEditor.element.selectionEnd);
        imageButton.dialog.style.visibility = 'visible';
        return;
      }
      imageButton.dialog.style.visibility = 'hidden';
    });

    var unorderedListButton = Object.create(_Button.Button);
    unorderedListButton.init('Unordered List', id, 'fa', 'fa-list-ul');
    unorderedListButton.listen('mousedown', buttonMousedown);
    unorderedListButton.listen('mouseup', buttonMouseup);
    unorderedListButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.unorderedList([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var orderedListButton = Object.create(_Button.Button);
    orderedListButton.init('Ordered List', id, 'fa', 'fa-list-ol');
    orderedListButton.listen('mousedown', buttonMousedown);
    orderedListButton.listen('mouseup', buttonMouseup);
    orderedListButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.orderedList([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var outdentButton = Object.create(_Button.Button);
    outdentButton.init('Outdent', id, 'fa', 'fa-outdent');
    outdentButton.listen('mousedown', buttonMousedown);
    outdentButton.listen('mouseup', buttonMouseup);
    outdentButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.outdent([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var indentButton = Object.create(_Button.Button);
    indentButton.init('Indent', id, 'fa', 'fa-indent');
    indentButton.listen('mousedown', buttonMousedown);
    indentButton.listen('mouseup', buttonMouseup);
    indentButton.listen('click', function (e) {
      e.preventDefault();
      markyEditor.element.focus();
      markyEditor.element._marky.indent([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    });

    var undoButton = Object.create(_Button.Button);
    undoButton.init('Undo', id, 'fa', 'fa-backward');
    undoButton.listen('mousedown', buttonMousedown);
    undoButton.listen('mouseup', buttonMouseup);
    undoButton.listen('click', function (e) {
      e.preventDefault();
      if (undoButton.element.classList.contains('disabled')) return;
      markyEditor.element.focus();
      markyEditor.element._marky.undo(1, markyEditor.element._marky.state, markyEditor.element._marky.index);
    });

    var redoButton = Object.create(_Button.Button);
    redoButton.init('Redo', id, 'fa', 'fa-forward');
    redoButton.listen('mousedown', buttonMousedown);
    redoButton.listen('mouseup', buttonMouseup);
    redoButton.listen('click', function (e) {
      e.preventDefault();
      if (redoButton.element.classList.contains('disabled')) return;
      markyEditor.element.focus();
      markyEditor.element._marky.redo(1, markyEditor.element._marky.state, markyEditor.element._marky.index);
    });

    var fullscreenButton = Object.create(_Button.Button);
    fullscreenButton.init('Fullscreen', id, 'fa', 'fa-expand');
    fullscreenButton.listen('click', function (e) {
      e.preventDefault();
      e.currentTarget.blur();
      e.currentTarget.classList.toggle('fullscreen-toggled');
      container.classList.toggle('fullscreen-toggled');
      markyEditor.element.classList.toggle('fullscreen-toggled');
      fullscreenButton.icon.element.classList.toggle('fa-expand');
      fullscreenButton.icon.element.classList.toggle('fa-compress');
    });

    /**
     * Create and register separators
     */

    var separatorA = Object.create(_Separator.Separator);
    separatorA.init();

    var separatorB = Object.create(_Separator.Separator);
    separatorB.init();

    var separatorC = Object.create(_Separator.Separator);
    separatorC.init();

    var separatorD = Object.create(_Separator.Separator);
    separatorD.init();

    var separatorE = Object.create(_Separator.Separator);
    separatorE.init();

    /**
     * Insert elements into the DOM
     */

    toolbar.appendTo(container);
    markyEditor.appendTo(container);
    markyOutput.appendTo(container);
    headingButton.appendTo(toolbar.element);
    separatorA.appendTo(toolbar.element);
    boldButton.appendTo(toolbar.element);
    italicButton.appendTo(toolbar.element);
    strikethroughButton.appendTo(toolbar.element);
    codeButton.appendTo(toolbar.element);
    blockquoteButton.appendTo(toolbar.element);
    separatorB.appendTo(toolbar.element);
    linkButton.appendTo(toolbar.element);
    imageButton.appendTo(toolbar.element);
    separatorC.appendTo(toolbar.element);
    unorderedListButton.appendTo(toolbar.element);
    orderedListButton.appendTo(toolbar.element);
    outdentButton.appendTo(toolbar.element);
    indentButton.appendTo(toolbar.element);
    separatorD.appendTo(toolbar.element);
    undoButton.appendTo(toolbar.element);
    redoButton.appendTo(toolbar.element);
    separatorE.appendTo(toolbar.element);
    fullscreenButton.appendTo(toolbar.element);
    dialogs.appendTo(toolbar.element);
    linkDialog.appendTo(dialogs.element);
    imageDialog.appendTo(dialogs.element);
    headingDialog.appendTo(dialogs.element);

    /**
     * Listeners for the editor
     */

    markyEditor.listen('markyupdate', function (e) {
      e.currentTarget._marky.update(e.currentTarget.value, [e.currentTarget.selectionStart, e.currentTarget.selectionEnd], e.currentTarget._marky.state, e.currentTarget._marky.index);
    }, false);

    markyEditor.listen('markychange', function (e) {
      var html = e.currentTarget._marky.state[e.currentTarget._marky.index].html;
      if (e.currentTarget._marky.index === 0) {
        undoButton.addClass('disabled');
      } else {
        undoButton.removeClass('disabled');
      }
      if (e.currentTarget._marky.index === e.currentTarget._marky.state.length - 1) {
        redoButton.addClass('disabled');
      } else {
        redoButton.removeClass('disabled');
      }
      e.currentTarget.nextSibling.value = html;
    }, false);

    /**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */
    markyEditor.listen('input', function (e) {
      window.clearTimeout(timeoutID);
      timeoutID = window.setTimeout(function () {
        e.currentTarget.dispatchEvent(_customEvents.markyupdate);
      }, 1000);
    }, false);

    /**
     * Listen for change events (requires loss of focus) and update state
     */
    markyEditor.listen('change', function (e) {
      e.currentTarget.dispatchEvent(_customEvents.markyupdate);
    }, false);

    /**
     * Listen for pasting into the editor and update state
     */
    markyEditor.listen('paste', function (e) {
      setTimeout(function () {
        e.currentTarget.dispatchEvent(_customEvents.markyupdate);
      }, 0);
    }, false);

    /**
     * Listen for cutting from the editor and update state
     */
    markyEditor.listen('cut', function (e) {
      setTimeout(function () {
        e.currentTarget.dispatchEvent(_customEvents.markyupdate);
      }, 0);
    }, false);

    var deleteSelection = 0;

    /**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */
    markyEditor.listen('keydown', function (e) {
      if (e.which === 8) deleteSelection = e.currentTarget.selectionEnd - e.currentTarget.selectionStart;
    });

    var keyMap = []; // Used for determining whether or not to update state on space keyup
    var punctuations = [46, // period
    44, // comma
    63, // question mark
    33, // exclamation point
    58, // colon
    59, // semi-colon
    47, // back slash
    92, // forward slash
    38, // ampersand
    124, // vertical pipe
    32 // space
    ];

    /**
     * Listen for keyup events,
     * if key is space or punctuation (but not a space following punctuation or another space),
     * update state and clear input timeout.
     */
    markyEditor.listen('keypress', function (e) {
      keyMap.push(e.which);
      if (keyMap.length > 2) keyMap.shift();
      punctuations.forEach(function (punctuation) {
        if (e.which === 32 && keyMap[0] === punctuation) {
          return window.clearTimeout(timeoutID);
        }
        if (e.which === punctuation) {
          window.clearTimeout(timeoutID);
          return e.currentTarget.dispatchEvent(_customEvents.markyupdate);
        }
      });
    });

    /**
     * Listen for keyup events,
     * if key is delete and it's a bulk selection,
     * update state and clear input timeout.
     */
    markyEditor.listen('keyup', function (e) {
      if (e.which === 8 && deleteSelection > 0) {
        window.clearTimeout(timeoutID);
        deleteSelection = 0;
        e.currentTarget.dispatchEvent(_customEvents.markyupdate);
      }
    });

    markyEditor.listen('select', function (e) {
      e.currentTarget.dispatchEvent(_customEvents.markyselect);
    });

    markyEditor.listen('blur', function (e) {
      e.currentTarget.dispatchEvent(_customEvents.markyblur);
    });

    markyEditor.listen('focus', function (e) {
      e.currentTarget.dispatchEvent(_customEvents.markyfocus);
    });

    markyEditor.listen('click', function () {
      imageDialog.element.style.visibility = 'hidden';
      imageDialog.removeClass('toggled');
      linkDialog.element.style.visibility = 'hidden';
      linkDialog.removeClass('toggled');
      headingDialog.element.style.visibility = 'hidden';
      headingDialog.removeClass('toggled');
    });
  });
};

var _Marky = require('./Marky');

var _Element = require('./Element');

var _Button = require('./Button');

var _Dialogs = require('./Dialogs');

var _Separator = require('./Separator');

var _customEvents = require('./custom-events');

var timeoutID = undefined; // Used later for input events

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {String}  tag name to be used for initialization
 */

},{"./Button":4,"./Dialogs":5,"./Element":6,"./Marky":9,"./Separator":10,"./custom-events":11}],15:[function(require,module,exports){
'use strict';

/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexOfMatch = indexOfMatch;
exports.indicesOfMatches = indicesOfMatches;
exports.lastIndexOfMatch = lastIndexOfMatch;
exports.splitLinesBackward = splitLinesBackward;
exports.splitLines = splitLines;
exports.startOfLine = startOfLine;
exports.endOfLine = endOfLine;
function indexOfMatch(string, regex, index) {
  var str = index !== null ? string.substring(index) : string;
  var matches = str.match(regex);
  return matches ? str.indexOf(matches[0]) + index : -1;
}

/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */
function indicesOfMatches(string, regex, index) {
  var str = index !== null ? string.substring(index) : string;
  var matches = str.match(regex);
  var indices = [];
  matches.forEach(function (match, i) {
    var prevIndex = indices ? indices[i - 1] : null;
    indices.push(str.indexOf(match, prevIndex + 1) + index);
  });
  return indices || -1;
}

/**
 * Finds the last index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional ending index
 * @returns {Number} the index of the match
 */
function lastIndexOfMatch(string, regex, index) {
  var str = index !== null ? string.substring(0, index) : string;
  var matches = str.match(regex);
  return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
}

/**
 * Creates an array of lines separated by line breaks
 * @param   {Number} index optional ending index
 * @returns {Array}  an array of strings
 */
function splitLinesBackward(string, index) {
  var str = index ? string.substring(0, index) : string;
  return str.split(/\r\n|\r|\n/);
}

/**
 * Creates an array of lines split by line breaks
 * @param   {Number} index optional starting index
 * @returns {Array}  an array of strings
 */
function splitLines(string, index) {
  var str = index ? string.substring(index) : string;
  return str.split(/\r\n|\r|\n/);
}

/**
 * Finds the start of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line start
 */
function startOfLine(string) {
  var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return lastIndexOfMatch(string, /^.*/gm, index);
}

/**
 * Finds the end of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line end
 */
function endOfLine(string) {
  var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return indexOfMatch(string, /(\r|\n|$)/gm, index);
}

},{}],16:[function(require,module,exports){
'use strict';

/**
 * Handles adding and removing state
 * @param   {Array}    state      the state timeline
 * @param   {Number}   stateIndex the current state index
 * @param   {Function} fn         a function to call
 * @returns {Object}   the new timeline
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, stateIndex, fn) {
  state = state.slice(0, stateIndex + 1);
  var newVersion = fn();
  state.push(newVersion);
  stateIndex++;
  if (stateIndex > 999) {
    state.shift();
    stateIndex--;
  }
  return { state: state, index: stateIndex };
};

},{}]},{},[1])(1)
});


//# sourceMappingURL=marky.js.map
