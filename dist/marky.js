(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.marky = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _srcMarky = require('./src/marky');

var marky = new _srcMarky.Marky();
exports['default'] = marky;
module.exports = exports['default'];

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

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-mark
 */

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modulesPrototypes = require('./modules/prototypes');

var _modulesPrototypes2 = _interopRequireDefault(_modulesPrototypes);

var _modulesMark = require('./modules/mark');

var _modulesMark2 = _interopRequireDefault(_modulesMark);

var _modulesDispatcher = require('./modules/dispatcher');

var dispatcher = _interopRequireWildcard(_modulesDispatcher);

var _modulesCustomEvents = require('./modules/custom-events');

(0, _modulesPrototypes2['default'])();

var Marky = (function () {
	function Marky(editor) {
		_classCallCheck(this, Marky);

		this.mark = _modulesMark2['default'];
		this.state = [{ markdown: '', html: '' }];
		this.index = 0;
		this.editor = editor;
	}

	_createClass(Marky, [{
		key: 'update',
		value: function update(markdown) {
			var state = arguments.length <= 1 || arguments[1] === undefined ? this.state : arguments[1];
			var index = arguments.length <= 2 || arguments[2] === undefined ? this.index : arguments[2];

			var action = dispatcher.update(markdown, state, index);
			this.state = action.state;
			this.index = action.index;
		}
	}, {
		key: 'undo',
		value: function undo() {
			var num = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];
			var state = arguments.length <= 1 || arguments[1] === undefined ? this.state : arguments[1];
			var index = arguments.length <= 2 || arguments[2] === undefined ? this.index : arguments[2];
			var editor = arguments.length <= 3 || arguments[3] === undefined ? this.editor : arguments[3];

			if (index === 0) return state[0];

			var action = dispatcher.undo(num, state, index);
			this.index = action.index;
			editor.value = action.state.markdown;
			editor.nextSibling.value = action.state.html;
			editor.dispatchEvent(_modulesCustomEvents.markychange);
			return this.index;
		}
	}, {
		key: 'redo',
		value: function redo() {
			var num = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];
			var state = arguments.length <= 1 || arguments[1] === undefined ? this.state : arguments[1];
			var index = arguments.length <= 2 || arguments[2] === undefined ? this.index : arguments[2];
			var editor = arguments.length <= 3 || arguments[3] === undefined ? this.editor : arguments[3];

			if (index === state.length - 1) return state[state.length - 1];

			var action = dispatcher.redo(num, state, index);
			this.index = action.index;
			editor.value = action.state.markdown;
			editor.nextSibling.value = action.state.html;
			editor.dispatchEvent(_modulesCustomEvents.markychange);
			return this.index;
		}
	}, {
		key: 'setSelection',
		value: function setSelection() {
			var arr = arguments.length <= 0 || arguments[0] === undefined ? [0, 0] : arguments[0];
			var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

			editor.setSelectionRange(arr[0], arr[1]);
			return arr;
		}
	}, {
		key: 'expandSelectionForward',
		value: function expandSelectionForward() {
			var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

			var start = editor.selectionStart;
			var end = editor.selectionEnd + num;

			editor.setSelectionRange(start, end);
			return [start, end];
		}
	}, {
		key: 'expandSelectionBackward',
		value: function expandSelectionBackward() {
			var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

			var start = editor.selectionStart - num;
			var end = editor.selectionEnd;

			editor.setSelectionRange(start, end);
			return [start, end];
		}
	}, {
		key: 'moveCursorBackward',
		value: function moveCursorBackward() {
			var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

			var start = editor.selectionStart - num;

			editor.setSelectionRange(start, start);
			return start;
		}
	}, {
		key: 'moveCursorForward',
		value: function moveCursorForward() {
			var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var editor = arguments.length <= 1 || arguments[1] === undefined ? this.editor : arguments[1];

			var start = editor.selectionStart + num;

			editor.setSelectionRange(start, start);
			return start;
		}
	}]);

	return Marky;
})();

exports.Marky = Marky;

},{"./modules/custom-events":8,"./modules/dispatcher":9,"./modules/mark":11,"./modules/prototypes":13}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Element12 = require('./Element');

var _handlers = require('./handlers');

var _customEvents = require('./custom-events');

var BoldButton = (function (_Element) {
	_inherits(BoldButton, _Element);

	function BoldButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Bold';

		_classCallCheck(this, BoldButton);

		_get(Object.getPrototypeOf(BoldButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(BoldButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var editor = this.parent.element;
		var icon = new _Element12.Element('i');
		icon.addClass(['fa', 'fa-bold']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(BoldButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(BoldButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var boldify = (0, _handlers.inlineHandler)(editor.value, indices, '**');
			editor.value = boldify.value;
			editor.setSelectionRange(boldify.range[0], boldify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return BoldButton;
})(_Element12.Element);

exports.BoldButton = BoldButton;

var ItalicButton = (function (_Element2) {
	_inherits(ItalicButton, _Element2);

	function ItalicButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Italic';

		_classCallCheck(this, ItalicButton);

		_get(Object.getPrototypeOf(ItalicButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(ItalicButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var editor = this.parent.element;
		var icon = new _Element12.Element('i');
		icon.addClass(['fa', 'fa-italic']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(ItalicButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(ItalicButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var italicize = (0, _handlers.inlineHandler)(editor.value, indices, '_');
			editor.value = italicize.value;
			editor.setSelectionRange(italicize.range[0], italicize.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return ItalicButton;
})(_Element12.Element);

exports.ItalicButton = ItalicButton;

var StrikethroughButton = (function (_Element3) {
	_inherits(StrikethroughButton, _Element3);

	function StrikethroughButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Strikethrough';

		_classCallCheck(this, StrikethroughButton);

		_get(Object.getPrototypeOf(StrikethroughButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(StrikethroughButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-strikethrough']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(StrikethroughButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(StrikethroughButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var strikitize = (0, _handlers.inlineHandler)(editor.value, indices, '~~');
			editor.value = strikitize.value;
			editor.setSelectionRange(strikitize.range[0], strikitize.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return StrikethroughButton;
})(_Element12.Element);

exports.StrikethroughButton = StrikethroughButton;

var CodeButton = (function (_Element4) {
	_inherits(CodeButton, _Element4);

	function CodeButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Code';

		_classCallCheck(this, CodeButton);

		_get(Object.getPrototypeOf(CodeButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(CodeButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-code']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(CodeButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(CodeButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var codify = (0, _handlers.inlineHandler)(editor.value, indices, '`');
			editor.value = codify.value;
			editor.setSelectionRange(codify.range[0], codify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return CodeButton;
})(_Element12.Element);

exports.CodeButton = CodeButton;

var BlockquoteButton = (function (_Element5) {
	_inherits(BlockquoteButton, _Element5);

	function BlockquoteButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Blockquote';

		_classCallCheck(this, BlockquoteButton);

		_get(Object.getPrototypeOf(BlockquoteButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(BlockquoteButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-quote-right']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(BlockquoteButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(BlockquoteButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var quotify = (0, _handlers.blockHandler)(editor.value, indices, '> ');
			editor.value = quotify.value;
			editor.setSelectionRange(quotify.range[0], quotify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return BlockquoteButton;
})(_Element12.Element);

exports.BlockquoteButton = BlockquoteButton;

var LinkButton = (function (_Element6) {
	_inherits(LinkButton, _Element6);

	function LinkButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Link';

		_classCallCheck(this, LinkButton);

		_get(Object.getPrototypeOf(LinkButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(LinkButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-link']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(LinkButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(LinkButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var mark = '[DISPLAY TEXT](http://url.com)';
			var linkify = (0, _handlers.insertHandler)(editor.value, indices, mark);
			editor.value = linkify.value;
			editor.setSelectionRange(linkify.range[0], linkify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return LinkButton;
})(_Element12.Element);

exports.LinkButton = LinkButton;

var ImageButton = (function (_Element7) {
	_inherits(ImageButton, _Element7);

	function ImageButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Image';

		_classCallCheck(this, ImageButton);

		_get(Object.getPrototypeOf(ImageButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(ImageButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-file-image-o']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(ImageButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(ImageButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var mark = '![ALT TEXT](http://imagesource.com/image.jpg)';
			var imagify = (0, _handlers.insertHandler)(editor.value, indices, mark);
			editor.value = imagify.value;
			editor.setSelectionRange(imagify.range[0], imagify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return ImageButton;
})(_Element12.Element);

exports.ImageButton = ImageButton;

var UnorderedListButton = (function (_Element8) {
	_inherits(UnorderedListButton, _Element8);

	function UnorderedListButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Unordered-List';

		_classCallCheck(this, UnorderedListButton);

		_get(Object.getPrototypeOf(UnorderedListButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(UnorderedListButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-list-ul']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(UnorderedListButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(UnorderedListButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var listify = (0, _handlers.listHandler)(editor.value, indices, 'ul');
			editor.value = listify.value;
			editor.setSelectionRange(listify.range[0], listify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return UnorderedListButton;
})(_Element12.Element);

exports.UnorderedListButton = UnorderedListButton;

var OrderedListButton = (function (_Element9) {
	_inherits(OrderedListButton, _Element9);

	function OrderedListButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Ordered-List';

		_classCallCheck(this, OrderedListButton);

		_get(Object.getPrototypeOf(OrderedListButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(OrderedListButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-list-ol']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(OrderedListButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(OrderedListButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var listify = (0, _handlers.listHandler)(editor.value, indices, 'ol');
			editor.value = listify.value;
			editor.setSelectionRange(listify.range[0], listify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state[editor._marky.index].html;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(_customEvents.update);
		});
	}

	return OrderedListButton;
})(_Element12.Element);

exports.OrderedListButton = OrderedListButton;

var UndoButton = (function (_Element10) {
	_inherits(UndoButton, _Element10);

	function UndoButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Undo';

		var _this = this;

		_classCallCheck(this, UndoButton);

		_get(Object.getPrototypeOf(UndoButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(UndoButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-step-backward']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(UndoButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(UndoButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			if (_this.element.classList.contains('disabled')) return;
			editor.focus();
			return editor._marky.undo(editor._marky.state, editor._marky.index);
		});
	}

	return UndoButton;
})(_Element12.Element);

exports.UndoButton = UndoButton;

var RedoButton = (function (_Element11) {
	_inherits(RedoButton, _Element11);

	function RedoButton(type, title, id, parent) {
		if (type === undefined) type = 'button';
		if (title === undefined) title = 'Redo';

		var _this2 = this;

		_classCallCheck(this, RedoButton);

		_get(Object.getPrototypeOf(RedoButton.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(RedoButton.prototype), 'addClass', this).call(this, [this.title, id]);
		var icon = new _Element12.Element('i');
		var editor = this.parent.element;
		icon.addClass(['fa', 'fa-step-forward']);
		icon.appendTo(this.element);
		_get(Object.getPrototypeOf(RedoButton.prototype), 'listen', this).call(this, 'mousedown', function (e) {
			e.preventDefault();
			editor.focus();
		});
		_get(Object.getPrototypeOf(RedoButton.prototype), 'listen', this).call(this, 'click', function (e) {
			e.preventDefault();
			if (_this2.element.classList.contains('disabled')) return;
			editor.focus();
			return editor._marky.redo(editor._marky.state, editor._marky.index);
		});
	}

	return RedoButton;
})(_Element12.Element);

exports.RedoButton = RedoButton;

},{"./Element":5,"./custom-events":8,"./handlers":10}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = (function () {
	function Element(type) {
		var title = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
		var parent = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

		_classCallCheck(this, Element);

		this.title = title;
		this.type = type;
		this.id = id;
		this.parent = parent;
		this.element = this.register();
		if (this.title) this.element.title = this.title;
	}

	_createClass(Element, [{
		key: "register",
		value: function register() {
			return document.createElement(this.type);
		}
	}, {
		key: "assign",
		value: function assign(prop, value) {
			return this.element[prop] = value;
		}
	}, {
		key: "appendTo",
		value: function appendTo(container) {
			return container.appendChild(this.element);
		}
	}, {
		key: "addClass",
		value: function addClass(classNames) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = classNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var className = _step.value;

					this.element.classList.add(className.toLowerCase());
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return;
		}
	}, {
		key: "removeClass",
		value: function removeClass(classNames) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = classNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var className = _step2.value;

					this.element.classList.remove(className.toLowerCase());
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
						_iterator2["return"]();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return;
		}
	}, {
		key: "listen",
		value: function listen(evt, cb) {
			return this.element.addEventListener(evt, cb);
		}
	}]);

	return Element;
})();

exports.Element = Element;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Element2 = require('./Element');

var HeadingOption = (function (_Element) {
	_inherits(HeadingOption, _Element);

	function HeadingOption(type, title, value) {
		if (type === undefined) type = 'option';

		_classCallCheck(this, HeadingOption);

		_get(Object.getPrototypeOf(HeadingOption.prototype), 'constructor', this).call(this, type, title);
		_get(Object.getPrototypeOf(HeadingOption.prototype), 'addClass', this).call(this, [this.title.replace(' ', '-')]);
		_get(Object.getPrototypeOf(HeadingOption.prototype), 'assign', this).call(this, 'value', value);
		_get(Object.getPrototypeOf(HeadingOption.prototype), 'assign', this).call(this, 'textContent', this.title);
	}

	return HeadingOption;
})(_Element2.Element);

exports.HeadingOption = HeadingOption;

},{"./Element":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Element2 = require('./Element');

var _Options = require('./Options');

var _handlers = require('./handlers');

var _customEvents = require('./custom-events');

var HeadingSelect = (function (_Element) {
	_inherits(HeadingSelect, _Element);

	function HeadingSelect(type, title, id, parent) {
		if (type === undefined) type = 'select';
		if (title === undefined) title = 'Heading';

		var _this = this;

		_classCallCheck(this, HeadingSelect);

		_get(Object.getPrototypeOf(HeadingSelect.prototype), 'constructor', this).call(this, type, title, id, parent);
		_get(Object.getPrototypeOf(HeadingSelect.prototype), 'addClass', this).call(this, [this.title, id]);
		var editor = parent.element;
		_get(Object.getPrototypeOf(HeadingSelect.prototype), 'listen', this).call(this, 'change', function () {
			var selected = _this.element.selectedIndex;
			var value = _this.element.options[selected].value;
			editor.focus();
			var indices = [editor.selectionStart, editor.selectionEnd];
			var headingify = (0, _handlers.blockHandler)(editor.value, indices, value + ' ');
			editor.value = headingify.value;
			editor.setSelectionRange(headingify.range[0], headingify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			var html = editor._marky.state.get(editor._marky.index).get('html');
			_this.element.selectedIndex = 0;
			editor.nextSibling.value = html;
			editor.dispatchEvent(_customEvents.update);
		});

		var optionPlaceholder = new _Options.HeadingOption('option', 'Headings', '');
		optionPlaceholder.assign('value', '');
		var remove = new _Options.HeadingOption('option', 'Remove', '');
		var option1 = new _Options.HeadingOption('option', 'Heading 1', '#');
		var option2 = new _Options.HeadingOption('option', 'Heading 2', '##');
		var option3 = new _Options.HeadingOption('option', 'Heading 3', '###');
		var option4 = new _Options.HeadingOption('option', 'Heading 4', '####');
		var option5 = new _Options.HeadingOption('option', 'Heading 5', '#####');
		var option6 = new _Options.HeadingOption('option', 'Heading 6', '######');

		optionPlaceholder.appendTo(this.element);
		remove.appendTo(this.element);
		option1.appendTo(this.element);
		option2.appendTo(this.element);
		option3.appendTo(this.element);
		option4.appendTo(this.element);
		option5.appendTo(this.element);
		option6.appendTo(this.element);
	}

	return HeadingSelect;
})(_Element2.Element);

exports.HeadingSelect = HeadingSelect;

},{"./Element":5,"./Options":6,"./custom-events":8,"./handlers":10}],8:[function(require,module,exports){
// Custom Event Polyfill for IE9+
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
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

var markyblur = new CustomEvent('markyblur');
exports.markyblur = markyblur;
var markyfocus = new CustomEvent('markyfocus');
exports.markyfocus = markyfocus;
var markyselect = new CustomEvent('markyselect');
exports.markyselect = markyselect;
var update = new CustomEvent('update');
exports.update = update;
var markychange = new CustomEvent('markychange');
exports.markychange = markychange;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.update = update;
exports.undo = undo;
exports.redo = redo;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _operation = require('./operation');

var _operation2 = _interopRequireDefault(_operation);

function update(markdown, state, stateIndex) {
	var html = (0, _marked2['default'])(markdown).toString() || '';
	//console.log(state);
	var newState = (0, _operation2['default'])(state, stateIndex, function () {
		//console.log(data);
		return { markdown: markdown, html: html };
		//return data.set('markdown', markdown).set('html', html);
	});
	return newState;
}

function undo(num, state, stateIndex) {
	stateIndex = stateIndex > num - 1 ? stateIndex - num : 0;
	return { state: state[stateIndex], index: stateIndex };
}

function redo(num, state, stateIndex) {
	stateIndex = stateIndex < state.length - (num + 1) ? stateIndex + num : state.length - 1;
	return { state: state[stateIndex], index: stateIndex };
}

},{"./operation":12,"marked":2}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.inlineHandler = inlineHandler;
exports.blockHandler = blockHandler;
exports.listHandler = listHandler;
exports.insertHandler = insertHandler;

function inlineHandler(string, indices, mark) {
	var value = undefined;
	var useMark = [mark, mark];
	if (string.indexOf(mark) !== -1) {
		for (var index in indices) {
			if (string.lastIndexOf(mark, indices[index]) === indices[index] - mark.length) {
				string = string.substring(0, indices[index] - mark.length) + string.substring(indices[index], string.length);
				if (index == 0) {
					indices[0] = indices[0] - mark.length;
					indices[1] = indices[1] - mark.length;
				} else {
					indices[1] = indices[1] - mark.length;
				}
				if (index == 1 && useMark[0]) indices[1] = indices[1] + mark.length;
				useMark[index] = '';
			}
			if (string.indexOf(mark, indices[index]) == indices[index]) {
				string = string.substring(0, indices[index]) + string.substring(indices[index] + mark.length, string.length);
				if (index == 0 && indices[0] != indices[1]) {
					indices[1] = indices[1] - mark.length;
				}
				if (index == 0 && indices[0] === indices[1]) {
					indices[0] = indices[0] - mark.length;
				}
				if (index == 1 && useMark[0]) indices[1] = indices[1] + mark.length;
				useMark[index] = '';
			}
		}
	}
	value = string.substring(0, indices[0]) + useMark[0] + string.substring(indices[0], indices[1]) + useMark[1] + string.substring(indices[1], string.length);
	return { value: value, range: [indices[0] + useMark[0].length, indices[1] + useMark[1].length] };
}

function blockHandler(string, indices, mark) {
	var start = indices[0];
	var end = indices[1];
	var value = undefined;
	var lineStart = string.lineStart(start);
	var lineEnd = string.lineEnd(end);
	if (string.indexOfMatch(/^[#>]/m, lineStart) === lineStart) {
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

function listHandler(string, indices, type) {
	var start = string.lineStart(indices[0]);
	var end = string.lineEnd(indices[1]);
	var lines = string.substring(start, end).splitLines();
	var newLines = [];
	var value = undefined;
	lines.forEach(function (line, i) {
		var mark = type === 'ul' ? '-' + ' ' : i + 1 + '.' + ' ';
		var newLine = undefined;
		if (line.indexOfMatch(/^[0-9#>-]/m, 0) === 0) {
			var currentFormat = line.substring(0, 0 + line.substring(0).search(/[~*`_]|[a-zA-Z]|\n|$/gm));
			newLine = line.substring(line.search(/[~*`_]|[a-zA-Z]|\n|$/gm), line.length);
			if (currentFormat.trim() !== mark.trim()) {
				newLine = mark + line.substring(line.search(/[~*`_]|[a-zA-Z]|\n|$/gm), line.length);
			}
			return newLines.push(newLine);
		}
		newLine = mark + line.substring(0, line.length);
		return newLines.push(newLine);
	});
	var joined = newLines.join('\r\n');
	value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
	return { value: value, range: [start, start + joined.length] };
}

function insertHandler(string, indices, mark) {
	var end = indices[1];
	var value = undefined;
	value = string.substring(0, end) + mark + string.substring(end, string.length);

	return { value: value, range: [end, end + mark.length] };
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _marky = require('../marky');

var _Element = require('./Element');

var _Buttons = require('./Buttons');

var _Selects = require('./Selects');

var _customEvents = require('./custom-events');

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param 	{String}	tag name to be used for initialization
 * @returns {Object} a Marky Mark instance
 */

exports['default'] = function () {
	var tag = arguments.length <= 0 || arguments[0] === undefined ? 'marky-mark' : arguments[0];

	var containers = document.getElementsByTagName(tag);
	Array.prototype.forEach.call(containers, function (container, i) {
		var toolbar = new _Element.Element('div', 'Toolbar');
		var id = 'editor-' + i;
		container.id = id;
		toolbar.addClass(['marky-toolbar', id]);

		var textarea = new _Element.Element('textarea', 'Editor');
		textarea.addClass(['marky-editor', id]);
		textarea.assign('_marky', new _marky.Marky(textarea.element));

		var input = new _Element.Element('input', 'Output');
		input.assign('type', 'hidden');
		input.addClass(['marky-output', id]);

		var headingSelect = new _Selects.HeadingSelect('select', 'Heading', id, textarea);
		var boldButton = new _Buttons.BoldButton('button', 'Bold', id, textarea);
		var italicButton = new _Buttons.ItalicButton('button', 'Italic', id, textarea);
		var strikethroughButton = new _Buttons.StrikethroughButton('button', 'Strikethrough', id, textarea);
		var codeButton = new _Buttons.CodeButton('button', 'Code', id, textarea);
		var blockquoteButton = new _Buttons.BlockquoteButton('button', 'Blockquote', id, textarea);
		var linkButton = new _Buttons.LinkButton('button', 'Link', id, textarea);
		var imageButton = new _Buttons.ImageButton('button', 'Image', id, textarea);
		var unorderedListButton = new _Buttons.UnorderedListButton('button', 'Unordered-List', id, textarea);
		var orderedListButton = new _Buttons.OrderedListButton('button', 'Ordered-List', id, textarea);
		var undoButton = new _Buttons.UndoButton('button', 'Undo', id, textarea);
		var redoButton = new _Buttons.RedoButton('button', 'Redo', id, textarea);

		var separatorA = new _Element.Element('span');
		separatorA.assign('textContent', '|');
		separatorA.addClass(['separator']);

		var separatorB = new _Element.Element('span');
		separatorB.assign('textContent', '|');
		separatorB.addClass(['separator']);

		var separatorC = new _Element.Element('span');
		separatorC.assign('textContent', '|');
		separatorC.addClass(['separator']);

		var separatorD = new _Element.Element('span');
		separatorD.assign('textContent', '|');
		separatorD.addClass(['separator']);

		toolbar.appendTo(container);
		textarea.appendTo(container);
		input.appendTo(container);
		headingSelect.appendTo(toolbar.element);
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
		separatorD.appendTo(toolbar.element);
		undoButton.appendTo(toolbar.element);
		redoButton.appendTo(toolbar.element);

		textarea.listen('update', function (e) {
			this._marky.update(e.target.value, this._marky.state, this._marky.index);
			return e.target.dispatchEvent(_customEvents.markychange);
		}, false);

		textarea.listen('markychange', function (e) {
			var html = this._marky.state[this._marky.index].html;
			if (this._marky.index === 0) {
				undoButton.addClass(['disabled']);
			} else {
				undoButton.removeClass(['disabled']);
			}
			if (this._marky.index === this._marky.state.length - 1) {
				redoButton.addClass(['disabled']);
			} else {
				redoButton.removeClass(['disabled']);
			}
			return e.target.nextSibling.value = html;
		}, false);

		textarea.listen('input', function (e) {
			return e.target.dispatchEvent(_customEvents.update);
		}, false);

		textarea.listen('select', function (e) {
			return e.target.dispatchEvent(_customEvents.markyselect);
		});

		textarea.listen('blur', function (e) {
			return e.target.dispatchEvent(_customEvents.markyblur);
		});

		textarea.listen('focus', function (e) {
			return e.target.dispatchEvent(_customEvents.markyfocus);
		});
	});
};

module.exports = exports['default'];

},{"../marky":3,"./Buttons":4,"./Element":5,"./Selects":7,"./custom-events":8}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (state, stateIndex, fn) {
	state = state.slice(0, stateIndex + 1);
	//console.log(state);
	//let newVersion = fn(state[stateIndex]);
	var newVersion = fn();
	//console.log(state);
	state.push(newVersion);
	//console.log(state);
	stateIndex++;
	if (stateIndex > 499) {
		state.shift();
		stateIndex--;
	}
	return { state: state, index: stateIndex };
};

module.exports = exports["default"];

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	String.prototype.indexOfMatch = function (regex, index) {
		var str = index !== null ? this.substring(index) : this;
		var matches = str.match(regex);
		return matches ? str.indexOf(matches[0]) + index : -1;
	};

	String.prototype.indicesOfMatches = function (regex, index) {
		var str = index !== null ? this.substring(index) : this;
		var matches = str.match(regex);
		var indices = [];
		matches.forEach(function (match, i) {
			var prevIndex = indices ? indices[i - 1] : null;
			indices.push(str.indexOf(match, prevIndex + 1) + index);
		});
		return indices ? indices : -1;
	};

	String.prototype.lastIndexOfMatch = function (regex, index) {
		var str = index !== null ? this.substring(0, index) : this;
		var matches = str.match(regex);
		return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
	};

	String.prototype.splitLinesBackward = function (index) {
		var str = index ? this.substring(0, index) : this;
		return str.split(/\r\n|\r|\n/);
	};

	String.prototype.splitLines = function (index) {
		var str = index ? this.substring(index) : this;
		return str.split(/\r\n|\r|\n/);
	};

	String.prototype.lineStart = function () {
		var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

		return this.lastIndexOfMatch(/^.*/gm, index);
	};

	String.prototype.lineEnd = function () {
		var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

		return this.indexOfMatch(/(\r|\n|$)/gm, index);
	};
};

module.exports = exports["default"];

},{}]},{},[1])(1)
});


//# sourceMappingURL=marky.js.map
