var atoa = function atoa (a, n) { return Array.prototype.slice.call(a, n); };

var curry = function curry () {
  var args = atoa(arguments);
  var method = args.shift();
  return function curried () {
    var more = atoa(arguments);
    method.apply(method, args.concat(more));
  };
};

var a = function a (o) { return Object.prototype.toString.call(o) === '[object Array]'; };

var noop = function noop () {};

var once = function once (fn) {
  var disposed;
  function disposable () {
    if (disposed) { return; }
    disposed = true;
    (fn || noop).apply(null, arguments);
  }
  disposable.discard = function () { disposed = true; };
  return disposable;
};

var si = typeof setImmediate === 'function';
var tick;
if (si) {
  tick = function (fn) { setImmediate(fn); };
} else if (typeof process !== 'undefined' && process.nextTick) {
  tick = process.nextTick;
} else {
  tick = function (fn) { setTimeout(fn, 0); };
}

var ticky = tick;

var debounce = function debounce (fn, args, ctx) {
  if (!fn) { return; }
  ticky(function run () {
    fn.apply(ctx || null, args || []);
  });
};

var emitter = function emitter (thing, options) {
  var opts = options || {};
  var evt = {};
  if (thing === undefined) { thing = {}; }
  thing.on = function (type, fn) {
    if (!evt[type]) {
      evt[type] = [fn];
    } else {
      evt[type].push(fn);
    }
    return thing;
  };
  thing.once = function (type, fn) {
    fn._once = true; // thing.off(fn) still works!
    thing.on(type, fn);
    return thing;
  };
  thing.off = function (type, fn) {
    var c = arguments.length;
    if (c === 1) {
      delete evt[type];
    } else if (c === 0) {
      evt = {};
    } else {
      var et = evt[type];
      if (!et) { return thing; }
      et.splice(et.indexOf(fn), 1);
    }
    return thing;
  };
  thing.emit = function () {
    var args = atoa(arguments);
    return thing.emitterSnapshot(args.shift()).apply(this, args);
  };
  thing.emitterSnapshot = function (type) {
    var et = (evt[type] || []).slice(0);
    return function () {
      var args = atoa(arguments);
      var ctx = this || thing;
      if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
      et.forEach(function emitter (listen) {
        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
        if (listen._once) { thing.off(type, listen); }
      });
      return thing;
    };
  };
  return thing;
};

var queue = function queue (worker, concurrency) {
  var q = [], load = 0, max = concurrency || 1, paused;
  var qq = emitter({
    push: manipulate.bind(null, 'push'),
    unshift: manipulate.bind(null, 'unshift'),
    pause: function pause () { paused = true; },
    resume: function resume () { paused = false; debounce(labor); },
    pending: q
  });
  if (Object.defineProperty && !Object.definePropertyPartial) {
    Object.defineProperty(qq, 'length', { get: function getter () { return q.length; } });
  }
  function manipulate (how, task, done) {
    var tasks = a(task) ? task : [task];
    tasks.forEach(function insert (t) { q[how]({ t: t, done: done }); });
    debounce(labor);
  }
  function labor () {
    if (paused || load >= max) { return; }
    if (!q.length) { if (load === 0) { qq.emit('drain'); } return; }
    load++;
    var job = q.pop();
    worker(job.t, once(complete.bind(null, job)));
    debounce(labor);
  }
  function complete (job) {
    load--;
    debounce(job.done, atoa(arguments, 1));
    debounce(labor);
  }
  return qq;
};

var errored = function errored (args, done, disposable) {
  var err = args.shift();
  if (err) { if (disposable) { disposable.discard(); } debounce(done, [err]); return true; }
};

var CONCURRENTLY = Infinity;

var concurrent = function concurrent (tasks, concurrency, done) {
  if (typeof concurrency === 'function') { done = concurrency; concurrency = CONCURRENTLY; }
  var d = once(done);
  var q = queue(worker, concurrency);
  var keys = Object.keys(tasks);
  var results = a(tasks) ? [] : {};
  q.unshift(keys);
  q.on('drain', function completed () { d(null, results); });
  function worker (key, next) {
    debounce(tasks[key], [proceed]);
    function proceed () {
      var args = atoa(arguments);
      if (errored(args, d)) { return; }
      results[key] = args.shift();
      next();
    }
  }
};

var SERIAL = 1;

var series = function series (tasks, done) {
  concurrent(tasks, SERIAL, done);
};

var waterfall = function waterfall (steps, done) {
  var d = once(done);
  function next () {
    var args = atoa(arguments);
    var step = steps.shift();
    if (step) {
      if (errored(args, d)) { return; }
      args.push(once(next));
      debounce(step, args);
    } else {
      debounce(d, arguments);
    }
  }
  next();
};

var _map = function _map (cap, then, attached) {
  function api (collection, concurrency, iterator, done) {
    var args = arguments;
    if (args.length === 2) { iterator = concurrency; concurrency = CONCURRENTLY; }
    if (args.length === 3 && typeof concurrency !== 'number') { done = iterator; iterator = concurrency; concurrency = CONCURRENTLY; }
    var keys = Object.keys(collection);
    var tasks = a(collection) ? [] : {};
    keys.forEach(function insert (key) {
      tasks[key] = function iterate (cb) {
        if (iterator.length === 3) {
          iterator(collection[key], key, cb);
        } else {
          iterator(collection[key], cb);
        }
      };
    });
    concurrent(tasks, cap || concurrency, then ? then(collection, once(done)) : done);
  }
  if (!attached) { api.series = _map(SERIAL, then, true); }
  return api;
};

var _each = function each (concurrency) {
  return _map(concurrency, then);
  function then (collection, done) {
    return function mask (err) {
      done(err); // only return the error, no more arguments
    };
  }
};

var each = _each();

var map = _map();

var _filter = function filter (concurrency) {
  return _map(concurrency, then);
  function then (collection, done) {
    return function filter (err, results) {
      function exists (item, key) {
        return !!results[key];
      }
      function ofilter () {
        var filtered = {};
        Object.keys(collection).forEach(function omapper (key) {
          if (exists(null, key)) { filtered[key] = collection[key]; }
        });
        return filtered;
      }
      if (err) { done(err); return; }
      done(null, a(results) ? collection.filter(exists) : ofilter());
    };
  }
};

var filter = _filter();

var contra = {
  curry: curry,
  concurrent: concurrent,
  series: series,
  waterfall: waterfall,
  each: each,
  map: map,
  filter: filter,
  queue: queue,
  emitter: emitter
};

var contra_1 = contra.emitter;

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function _createSalts(n, base) {
  var salts = [];
  for (var i = 0; i < n; i++) {
    salts.push(Math.floor(Math.random() * Math.pow(10, 6)).toString(base));
  }
  return salts;
}

function _createHash(id, salts, base) {
  var hash = id.toString(base);
  var pieces = [].concat(toConsumableArray(salts), [hash]);
  var hashString = '';
  do {
    var index = Math.floor(Math.random() * pieces.length);
    hashString += pieces[index];
    pieces.splice(index, 1);
  } while (pieces.length);
  return hashString;
}

/**
 * Simplified API to just return a single token using defaults
 * @return {String} a hash
 */
function hashish() {
  return _createHash([Math.floor(Math.random() * 100)], _createSalts(2, 36), 36);
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var marked = createCommonjsModule(function (module, exports) {
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

(function() {

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
        : cap[0];
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
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
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
      tokens = Lexer.lex(src, opt);
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

{
  module.exports = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : commonjsGlobal);
}());
});

/**
 * Handles adding and removing state
 * @param   {Array}    state      the state timeline
 * @param   {Number}   stateIndex the current state index
 * @param   {Object}   newState   the new state to push
 * @returns {Object}   the new timeline
 */
var pushState = function (state, stateIndex, newState) {
  state = state.slice(0, stateIndex + 1); // eslint-disable-line no-param-reassign
  state.push(newState);
  stateIndex += 1; // eslint-disable-line no-param-reassign
  if (stateIndex > 999) {
    state.shift();
    stateIndex -= 1; // eslint-disable-line no-param-reassign
  }

  return { state, index: stateIndex };
};

/**
 * updates the state
 * @external marked
 * @requires pushState
 * @param   {String} markdown   markdown blob
 * @param   {Array}  selection  selectionStart and selectionEnd indices
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
function update(markdown, selection, state, stateIndex) {
  const markedOptions = {
    sanitize: true
  };
  const html = marked(markdown, markedOptions).toString() || '';
  const newState = pushState(state, stateIndex, { markdown, html, selection });
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
  const newStateIndex = stateIndex > num - 1 ? stateIndex - num : 0;
  return { state: state[newStateIndex], index: newStateIndex };
}

/**
 * moves forwardin state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
function redo(num, state, stateIndex) {
  const newStateIndex = stateIndex < state.length - (num + 1) ? stateIndex + num : state.length - 1;
  return { state: state[newStateIndex], index: newStateIndex };
}

/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */
function indexOfMatch(string, regex, index) {
  const str = index !== null ? string.substring(index) : string;
  const matches = str.match(regex);
  return matches ? str.indexOf(matches[0]) + index : -1;
}

/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */


/**
 * Finds the last index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional ending index
 * @returns {Number} the index of the match
 */
function lastIndexOfMatch(string, regex, index) {
  const str = index !== null ? string.substring(0, index) : string;
  const matches = str.match(regex);
  return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
}

/**
 * Creates an array of lines separated by line breaks
 * @param   {Number} index optional ending index
 * @returns {Array}  an array of strings
 */


/**
 * Creates an array of lines split by line breaks
 * @param   {Number} index optional starting index
 * @returns {Array}  an array of strings
 */
function splitLines(string, index) {
  const str = index ? string.substring(index) : string;
  return str.split(/\r\n|\r|\n/);
}

/**
 * Finds the start of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line start
 */
function startOfLine(string, index = 0) {
  return lastIndexOfMatch(string, /^.*/gm, index);
}

/**
 * Finds the end of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line end
 */
function endOfLine(string, index = 0) {
  return indexOfMatch(string, /(\r|\n|$)/gm, index);
}

/**
 * Handles wrapping format strings around a selection
 * @param   {String} string         the entire string
 * @param   {Array}  selectionRange the starting and ending positions of the selection
 * @param   {String} symbol         the format string to use
 * @returns {Object} the new string, the updated selectionRange
 */
function inlineHandler(string, selectionRange, symbol) {
  let newString = string;
  const newSelectionRange = selectionRange;
  // useSymbol determines whether to add the symbol to either end of the selected text
  const useSymbol = [symbol, symbol];
  const symbolLength = symbol.length;

  // First check that the symbol is in the string at all
  if (newString.includes(symbol)) {
    // If it is, for each index in the selection range...
    newSelectionRange.forEach((selectionIndex, j) => {
      // If the symbol immediately precedes the selection index...
      if (newString.lastIndexOf(symbol, selectionIndex) === selectionIndex - symbolLength) {
        // First trim it
        newString = newString.substring(0, selectionIndex - symbolLength) + newString.substring(selectionIndex, newString.length);

        // Then adjust the selection range,
        // If this is the starting index in the range, we will have to adjust both
        // starting and ending indices
        if (j === 0) {
          newSelectionRange[0] -= symbolLength;
          newSelectionRange[1] -= symbolLength;
        } else if (!useSymbol[0]) {
          newSelectionRange[1] -= symbolLength;
        }

        // Finally, disallow the symbol at this end of the selection
        useSymbol[j] = '';
      }

      // If the symbol immediately follows the selection index...
      if (newString.indexOf(symbol, selectionIndex) === selectionIndex) {
        // Trim it
        newString = newString.substring(0, selectionIndex) + newString.substring(selectionIndex + symbolLength, newString.length);

        // Then adjust the selection range,
        // If this is the starting index in the range...
        if (j === 0) {
          // If the starting and ending indices are NOT the same (selection length > 0)
          // Adjust the ending selection down
          if (newSelectionRange[0] !== newSelectionRange[1]) {
            newSelectionRange[1] -= symbolLength;
          }
          // If the starting and ending indices are the same (selection length = 0)
          // Adjust the starting selection down
          if (newSelectionRange[0] === newSelectionRange[1]) {
            newSelectionRange[0] -= symbolLength;
          }
          // If this is the ending index and the range
          // AND we're inserting the symbol at the starting index,
          // Adjust the ending selection up
        } else if (useSymbol[0]) {
          newSelectionRange[1] += symbolLength;
        }

        // Finally, disallow the symbol at this end of the selection
        useSymbol[j] = '';
      }
    });
  }

  // Put it all together
  const value = newString.substring(0, newSelectionRange[0]) + useSymbol[0] + newString.substring(newSelectionRange[0], newSelectionRange[1]) + useSymbol[1] + newString.substring(newSelectionRange[1], newString.length);

  return {
    value,
    range: [newSelectionRange[0] + useSymbol[0].length, newSelectionRange[1] + useSymbol[1].length]
  };
}

/**
 * Handles adding/removing a format string to a line
 * @param   {String} string         the entire string
 * @param   {Array}  selectionRange the starting and ending positions of the selection
 * @param   {String} symbol         the format string to use
 * @returns {Object} the new string, the updated indices
 */
function blockHandler(string, selectionRange, symbol) {
  const start = selectionRange[0];
  const end = selectionRange[1];
  const boundaryRegex = /[0-9~*`_-]|\b|\n|$/gm;
  let value;
  let lineStart = startOfLine(string, start);
  let lineEnd = endOfLine(string, end);

  // If there is a block handler symbol at the start of the line...
  if (indexOfMatch(string, /^[#>]/m, lineStart) === lineStart) {
    // Find the first boundary from the start of the formatting symbol
    // May include white space
    const existingSymbolBoundary = string.substring(lineStart).search(boundaryRegex);
    const existingSymbol = string.substring(lineStart, existingSymbolBoundary);

    // Create new string without the existingSymbol
    value = string.substring(0, lineStart) + string.substring(existingSymbolBoundary, string.length);

    // And also subtract the length of the symbol from the lineEnd index
    lineEnd -= existingSymbol.length;

    // If it's some other block handler...
    if (symbol.trim().length && existingSymbol.trim() !== symbol.trim()) {
      // Create a new string with the symbol inserted
      value = string.substring(0, lineStart) + symbol + string.substring(existingSymbolBoundary, string.length);
      // And adjust lineStart and lineEnd indices
      lineStart += symbol.length;
      lineEnd += symbol.length;
    }

    return { value, range: [lineStart, lineEnd] };
  }

  // If not, pretty simple
  value = string.substring(0, lineStart) + symbol + string.substring(lineStart, string.length);
  return { value, range: [start + symbol.length, end + symbol.length] };
}

/**
 * Handles adding/removing format strings to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  selectionRange the starting and ending positions of the selection
 * @param   {String} type    ul or ol
 * @returns {Object} the new string, the updated selectionRange
 */
function listHandler(string, selectionRange, type) {
  const start = startOfLine(string, selectionRange[0]);
  const end = endOfLine(string, selectionRange[1]);
  const lines = splitLines(string.substring(start, end));
  const boundaryRegex = /[~*`_[!]|[a-zA-Z]|\r|\n|$/gm;
  const newLines = [];

  lines.forEach((line, i) => {
    const symbol = type === 'ul' ? '- ' : `${i + 1}. `;
    let newLine;

    // If the line begins with an existing list symbol
    if (indexOfMatch(line, /^[0-9#>-]/m, 0) === 0) {
      const existingSymbol = line.substring(0, 0 + line.substring(0).search(boundaryRegex));

      // Remove the symbol
      newLine = line.substring(line.search(boundaryRegex), line.length);
      if (existingSymbol.trim() !== symbol.trim()) {
        newLine = symbol + line.substring(line.search(boundaryRegex), line.length);
      }
      return newLines.push(newLine);
    }
    newLine = symbol + line.substring(0, line.length);
    return newLines.push(newLine);
  });

  // Put it all together
  const joined = newLines.join('\r\n');
  const value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
  return { value, range: [start, start + joined.replace(/\n/gm, '').length] };
}

/**
 * Handles adding/removing indentation to groups of lines
 * @param   {String} string         the entire string to use
 * @param   {Array}  selectionRange the starting and ending positions to wrap
 * @param   {String} type           in or out
 * @returns {Object} the new string, the updated selectionRange
 */
function indentHandler(string, selectionRange, type) {
  const start = startOfLine(string, selectionRange[0]);
  const end = endOfLine(string, selectionRange[1]);
  const lines = splitLines(string.substring(start, end));
  const newLines = [];

  lines.forEach(line => {
    const fourSpaces = '    ';
    let newLine;
    if (type === 'out') {
      newLine = line.indexOf(fourSpaces, 0) === 0 ? line.substring(fourSpaces.length, line.length) : line.substring(line.search(/[~*`_[!#>-]|[a-zA-Z0-9]|\r|\n|$/gm), line.length);
      return newLines.push(newLine);
    }
    newLine = fourSpaces + line.substring(0, line.length);
    return newLines.push(newLine);
  });

  const joined = newLines.join('\r\n');
  const value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
  return { value, range: [start, start + joined.replace(/\n/gm, '').length] };
}

/**
 * Handles inserting a snippet at the end of a selection
 * @param   {String} string         the entire string to use
 * @param   {Array}  selectionRange the starting and ending positions of the selection
 * @param   {String} snippet        the snippet to insert
 * @returns {Object} the new string, the updated selectionRange
 */
function insertHandler(string, selectionRange, snippet) {
  const start = selectionRange[0];
  const end = selectionRange[1];
  const value = string.substring(0, start) + snippet + string.substring(end, string.length);

  return { value, range: [start, start + snippet.length] };
}

class Marky {
  constructor(id, container, editor) {
    this.id = id;
    this.editor = editor.element;
    this.container = container;
    this.state = [{
      markdown: '',
      html: '',
      selection: [0, 0]
    }];
    this.index = 0;
    this.markdown = '';
    this.html = '';
    this.elements = {
      dialogs: {},
      buttons: {},
      editor
    };

    return this;
  }

  /**
   * Removes the container and all descendants from the DOM
   * @param  {container} container the container used to invoke `mark()`
   */
  destroy(container = this.container) {
    // Remove all listeners from all elements
    this.removeListeners(this.elements);

    // Reset elements contained in this instance to remove from memory
    this.elements = {
      dialogs: {},
      buttons: {},
      editor: null
    };
    this.editor = null;
    this.container = null;

    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  /**
   * Handles the `markyupdate` event
   * @requires dispatcher/update
   * @param {String} markdown   the new markdown blob
   * @param {Array}  selection  selectionStart and selectionEnd indices
   * @param {Array}  state      the state timeline
   * @param {Number} index      current state index
   */
  update(markdown, selection = [0, 0], state = this.state, index = this.index) {
    const action = update(markdown, selection, state, index);
    this.state = action.state;
    this.index = action.index;
    this.emit('markychange');
    return this.index;
  }

  /**
   * Handles the `markychange` event
   * @param  {String} markdown markdown string
   * @param  {String} html     html string
   */
  change(markdown, html) {
    this.updateMarkdown(markdown);
    this.updateHTML(html);
  }

  /**
   * Handles moving backward in state
   * @requires dispatcher/undo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  undo(num = 1, state = this.state, index = this.index, editor = this.editor) {
    if (index === 0) return index;

    const action = undo(num, state, index);
    this.index = action.index;
    this.updateEditor(action.state.markdown, action.state.selection, editor);
    this.emit('markychange');
    return this.index;
  }

  /**
   * Handles moving forward in state
   * @requires dispatcher/redo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  redo(num = 1, state = this.state, index = this.index, editor = this.editor) {
    if (index === state.length - 1) return index;

    const action = redo(num, state, index);
    this.index = action.index;
    this.updateEditor(action.state.markdown, action.state.selection, editor);
    this.emit('markychange');
    return this.index;
  }

  /**
   * Sets the selection indices in the editor
   * @param   {Array}       arr    starting and ending indices
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the array that was passed in
   */
  setSelection(arr = [0, 0], editor = this.editor) {
    editor.setSelectionRange(arr[0], arr[1]);
    return arr;
  }

  /**
   * expands the selection to the right
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */
  expandSelectionForward(num = 0, editor = this.editor) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd + num;

    editor.setSelectionRange(start, end);
    return [start, end];
  }

  /**
   * expands the selection to the left
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */
  expandSelectionBackward(num = 0, editor = this.editor) {
    const start = editor.selectionStart - num;
    const end = editor.selectionEnd;

    editor.setSelectionRange(start, end);
    return [start, end];
  }

  /**
   * expands the cursor to the right
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */
  moveCursorBackward(num = 0, editor = this.editor) {
    const start = editor.selectionStart - num;

    editor.setSelectionRange(start, start);
    return start;
  }

  /**
   * expands the cursor to the left
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */
  moveCursorForward(num = 0, editor = this.editor) {
    const start = editor.selectionStart + num;

    editor.setSelectionRange(start, start);
    return start;
  }

  /**
   * implements a bold on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */
  bold(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const boldify = inlineHandler(editor.value, indices, '**');
    this.updateEditor(boldify.value, boldify.range, editor);
    this.emit('markyupdate');
    return [boldify.range[0], boldify.range[1]];
  }

  /**
   * implements an italic on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the italic
   */
  italic(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const italicize = inlineHandler(editor.value, indices, '_');
    this.updateEditor(italicize.value, italicize.range, editor);
    this.emit('markyupdate');
    return [italicize.range[0], italicize.range[1]];
  }

  /**
   * implements a strikethrough on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the strikethrough
   */
  strikethrough(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const strikitize = inlineHandler(editor.value, indices, '~~');
    this.updateEditor(strikitize.value, strikitize.range, editor);
    this.emit('markyupdate');
    return [strikitize.range[0], strikitize.range[1]];
  }

  /**
   * implements a code on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the code
   */
  code(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const codify = inlineHandler(editor.value, indices, '`');
    this.updateEditor(codify.value, codify.range, editor);
    this.emit('markyupdate');
    return [codify.range[0], codify.range[1]];
  }

  /**
   * implements a blockquote on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */
  blockquote(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const quotify = blockHandler(editor.value, indices, '> ');
    this.updateEditor(quotify.value, quotify.range, editor);
    this.emit('markyupdate');
    return [quotify.range[0], quotify.range[1]];
  }

  /**
   * implements a heading on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the heading
   */
  heading(value = 0, indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const markArr = [];

    for (let i = 1; i <= value; i += 1) {
      markArr.push('#');
    }
    const mark = markArr.join('');
    const space = mark ? ' ' : '';
    const headingify = blockHandler(editor.value, indices, mark + space);
    this.updateEditor(headingify.value, headingify.range, editor);
    this.emit('markyupdate');
    return [headingify.range[0], headingify.range[1]];
  }

  /**
   * inserts a link snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */
  link(indices = [this.editor.selectionStart, this.editor.selectionEnd], url = 'http://url.com', display = 'http://url.com', editor = this.editor) {
    const mark = `[${display}](${url})`;
    const linkify = insertHandler(editor.value, indices, mark);
    this.updateEditor(linkify.value, linkify.range, editor);
    this.emit('markyupdate');
    return [linkify.range[0], linkify.range[1]];
  }

  /**
   * inserts an image snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */
  image(indices = [this.editor.selectionStart, this.editor.selectionEnd], source = 'http://imagesource.com/image.jpg', alt = 'http://imagesource.com/image.jpg', editor = this.editor) {
    const mark = `![${alt}](${source})`;
    const imageify = insertHandler(editor.value, indices, mark);
    this.updateEditor(imageify.value, imageify.range, editor);
    this.emit('markyupdate');
    return [imageify.range[0], imageify.range[1]];
  }

  /**
   * implements an unordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */
  unorderedList(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const listify = listHandler(editor.value, indices, 'ul');
    this.updateEditor(listify.value, listify.range, editor);
    this.emit('markyupdate');
    return [listify.range[0], listify.range[1]];
  }

  /**
   * implements an ordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */
  orderedList(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const listify = listHandler(editor.value, indices, 'ol');
    this.updateEditor(listify.value, listify.range, editor);
    this.emit('markyupdate');
    return [listify.range[0], listify.range[1]];
  }

  /**
   * implements an indent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the indent is implemented
   */
  indent(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const indentify = indentHandler(editor.value, indices, 'in');
    this.updateEditor(indentify.value, indentify.range, editor);
    this.emit('markyupdate');
    return [indentify.range[0], indentify.range[1]];
  }

  /**
   * implements an outdent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the outdent is implemented
   */
  outdent(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const indentify = indentHandler(editor.value, indices, 'out');
    this.updateEditor(indentify.value, indentify.range, editor);
    this.emit('markyupdate');
    return [indentify.range[0], indentify.range[1]];
  }

  /**
   * @private
   * Handles updating the markdown prop
   * @param  {String} markdown   user-input markdown
   */
  updateMarkdown(markdown) {
    this.markdown = markdown;
  }

  /**
   * @private
   * Handles updating the hidden input's value as well as html prop
   * @param  {String} html   an HTML string
   */
  updateHTML(html) {
    this.html = html;
  }

  /**
   * @private
   * Handles updating the editor's value and selection range
   * @param  {Object} handled value = string; range = start and end of selection
   * @param  {HTMLElement} editor  the marky marked editor
   */
  updateEditor(markdown, range, editor = this.editor) {
    editor.value = markdown; // eslint-disable-line no-param-reassign
    editor.setSelectionRange(range[0], range[1]);
  }

  /**
   * @private
   * Rescursively searches an object for elements and removes their listeners
   * @param  {Object} obj plain object (used only with the `elements` object in Marky)
   */
  removeListeners(obj) {
    Object.values(obj).forEach(value => {
      if (value.removeListeners) {
        value.removeListeners();
      } else {
        this.removeListeners(value);
      }
    });
  }
}

/**
 * Creates an HTML element with some built-in shortcut methods
 * @param {String}      type    tag name for the element
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class Element {
  constructor(type, title = null, id = null) {
    this.type = type;
    this.title = title;
    this.id = id;
    this.element = this.create();
    this.listeners = {};
    if (this.title) this.element.title = this.title;
  }

  create() {
    return document.createElement(this.type);
  }

  assign(prop, value) {
    this.element[prop] = value;

    return this;
  }

  appendTo(container) {
    container.appendChild(this.element);

    return this;
  }

  addClass(...classNames) {
    this.element.classList.add(...classNames.map(name => name.replace(/[ ]/g, '-').toLowerCase()));

    return this;
  }

  removeClass(...classNames) {
    this.element.classList.remove(...classNames.map(name => name.replace(/[ ]/g, '-').toLowerCase()));

    return this;
  }

  toggleClass(...classNames) {
    this.element.classList.toggle(...classNames.map(name => name.replace(/[ ]/g, '-').toLowerCase()));

    return this;
  }

  listen(evt, cb) {
    this.listeners[evt] = cb;
    this.element.addEventListener(evt, cb);

    return this;
  }

  removeListener(evt, cb) {
    this.element.removeEventListener(evt, cb);

    return this;
  }

  removeListeners() {
    Object.keys(this.listeners).forEach(listener => {
      this.removeListener(listener, this.listeners[listener]);
    });

    return this;
  }
}

/**
 * Creates HTML i elements
 * @type {Element}
 * @param {Array} classNames classes to use with element
 */
class Icon extends Element {
  constructor(...classNames) {
    super('i');
    this.addClass(...classNames);
  }
}

/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {Array}      iconClasses      classes to use for <i> elements
 */
class Button extends Element {
  constructor(title, id, ...iconClasses) {
    super('button', title, id);
    this.addClass(this.title, this.id).assign('value', this.title).assign('type', 'button');

    this.icon = new Icon(...iconClasses).appendTo(this.element);
  }
}

/**
 * Creates dialog elements
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class Dialog extends Element {
  constructor(title, id) {
    super('div', title, id);
    this.addClass(this.title, id, 'dialog');
  }
}

/**
 * Creates dialog (modal) elements
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class LinkDialog extends Dialog {
  constructor(title, id) {
    super(title, id);
    this.addClass(this.title, id, 'dialog');

    this.form = new Element('form', 'Link Form').assign('id', `${this.id}-link-form`).appendTo(this.element);

    this.urlInput = new Element('input', 'Link Url').addClass('link-url-input').assign('type', 'text').assign('name', `${this.id}-link-url-input`).assign('placeholder', 'http://url.com').appendTo(this.form.element);

    this.nameInput = new Element('input', 'Link Display').addClass('link-display-input').assign('type', 'text').assign('name', `${this.id}-link-display-input`).assign('placeholder', 'Display text').appendTo(this.form.element);

    this.insertButton = new Element('button', 'Insert Link').addClass('insert-link').assign('type', 'submit').assign('textContent', 'Insert').appendTo(this.form.element);
  }
}

/**
 * Creates image dialog modal
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class ImageDialog extends Dialog {
  constructor(title, id) {
    super(title, id);
    this.addClass(this.title, id, 'dialog');

    this.form = new Element('form', 'Image Form').assign('id', `${this.id}-image-form`).appendTo(this.element);

    this.urlInput = new Element('input', 'Image Source').addClass('image-source-input').assign('type', 'text').assign('name', `${this.id}-image-source-input`).assign('placeholder', 'http://url.com/image.jpg').appendTo(this.form.element);

    this.nameInput = new Element('input', 'Image Alt').addClass('image-alt-input').assign('type', 'text').assign('name', `${this.id}-image-alt-input`).assign('placeholder', 'Alt text').appendTo(this.form.element);

    this.insertButton = new Element('button', 'Insert Image').addClass('insert-image').assign('type', 'submit').assign('textContent', 'Insert').appendTo(this.form.element);
  }
}

/**
 * Creates HTML option elements
 * @type {Element}
 * @requires  Icon
 * @param {String}  title   title for the element
 * @param {String}  value   a value to assign the element
 * @param {Array}  iconClasses    classes to use for <i> elements
 */
class HeadingItem extends Element {
  constructor(title, value, ...iconClasses) {
    super('li', title);
    this.addClass(this.title.replace(' ', '-')).assign('value', value);

    this.button = new Element('button', title).assign('type', 'button').assign('value', value).addClass('heading-button').appendTo(this.element);

    if (iconClasses.length) {
      this.icon = new Icon(...iconClasses).appendTo(this.button.element);
    } else {
      this.button.assign('textContent', value);
    }
  }
}

/**
 * Creates heading dialog element
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class HeadingDialog extends Dialog {
  constructor(title, id) {
    super(title, id);
    this.addClass(this.title, id, 'dialog');
    this.headingList = new Element('ul', 'Heading List').assign('id', `${id}-heading-list`).appendTo(this.element);

    this.options = [...Array(6)].map((_, i) => new HeadingItem(`Heading ${i + 1}`, i + 1));
    this.options.push(new HeadingItem('Remove Heading', '0', 'fa', 'fa-remove'));

    this.options.forEach(option => {
      option.appendTo(this.headingList.element);
    });
  }
}

/**
 * Create separator spans for the toolbar
 * @type {Element}
 */
class Separator extends Element {
  constructor() {
    super('span');
    this.addClass('separator');
  }
}

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {HTMLElement}  container empty element to initialize marky marked into
 */
var initializer = (container => {
  if (!(container instanceof HTMLElement)) {
    throw new TypeError('argument should be an HTMLElement');
  }

  /**
     * Ignore container if it's not empty
     */
  if (container.children.length) {
    return null;
  }

  const id = `marky-mark-${hashish()}`;
  container.id = id; // eslint-disable-line no-param-reassign

  /**
     * Create and register main elements:
     * toolbar, editor, dialog container, hidden input
     */

  const toolbar = new Element('div', 'Toolbar').addClass('marky-toolbar', id);
  const dialogs = new Element('div', 'Dialogs').addClass('marky-dialogs', id);
  const markyEditor = new Element('textarea', 'Marky Marked Editor').addClass('marky-editor', id);

  const marky = contra_1(new Marky(id, container, markyEditor));
  container.marky = marky; // eslint-disable-line no-param-reassign

  /**
     * Create and register dialogs and set listeners
     */

  marky.elements.dialogs = {
    heading: new HeadingDialog('Heading Dialog', id),
    link: new LinkDialog('Link Dialog', id),
    image: new ImageDialog('Image Dialog', id)
  };

  Object.entries(marky.elements.dialogs).forEach(([dialogName, dialog]) => {
    if (dialogName === 'heading') {
      dialog.options.forEach(option => {
        option.listen('click', e => {
          e.preventDefault();
          const value = parseInt(e.target.value, 10);
          markyEditor.element.focus();
          dialog.removeClass('toggled');
          marky.heading(value, [markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
        });
      });
    } else {
      dialog.form.listen('submit', e => {
        e.preventDefault();
        markyEditor.element.focus();
        const url = dialog.urlInput.element.value.slice(0) || 'http://url.com';
        const name = dialog.nameInput.element.value.slice(0) || url;
        dialog.removeClass('toggled');
        marky[dialogName]([markyEditor.element.selectionStart, markyEditor.element.selectionEnd], url, name);
      });
    }
  });

  /**
     * Create and register toolbar buttons and set listeners
     */

  function buttonMousedown(e) {
    e.preventDefault();
    markyEditor.element.focus();
  }

  function buttonClick(button, name) {
    if (button.classList.contains('disabled')) return;
    if (name === 'undo' || name || 'redo') {
      marky[name]();
    } else {
      marky[name]([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    }
  }

  marky.elements.buttons = {
    heading: new Button('Heading', id, 'fa', 'fa-header'),
    bold: new Button('Bold', id, 'fa', 'fa-bold'),
    italic: new Button('Italic', id, 'fa', 'fa-italic'),
    strikethrough: new Button('Strikethrough', id, 'fa', 'fa-strikethrough'),
    code: new Button('Code', id, 'fa', 'fa-code'),
    blockquote: new Button('Blockquote', id, 'fa', 'fa-quote-right'),
    link: new Button('Link', id, 'fa', 'fa-link'),
    image: new Button('Image', id, 'fa', 'fa-file-image-o'),
    unorderedList: new Button('Unordered List', id, 'fa', 'fa-list-ul'),
    orderedList: new Button('Ordered List', id, 'fa', 'fa-list-ol'),
    outdent: new Button('Outdent', id, 'fa', 'fa-outdent'),
    indent: new Button('Indent', id, 'fa', 'fa-indent'),
    undo: new Button('Undo', id, 'fa', 'fa-backward'),
    redo: new Button('Redo', id, 'fa', 'fa-forward'),
    expand: new Button('Expand', id, 'fa', 'fa-expand')
  };

  Object.entries(marky.elements.buttons).forEach(([buttonName, button]) => {
    button.listen('mousedown', buttonMousedown);
    if (Object.keys(marky.elements.dialogs).includes(buttonName)) {
      // eslint-disable-next-line no-param-reassign
      button.dialog = marky.elements.dialogs[buttonName].element;
      button.listen('click', () => {
        Object.keys(marky.elements.dialogs).forEach(dialogName => {
          if (dialogName === buttonName) marky.elements.dialogs[buttonName].toggleClass('toggled');else marky.elements.dialogs[dialogName].removeClass('toggled');
        });

        if ((buttonName === 'link' || buttonName === 'image') && button.dialog.classList.contains('toggled')) {
          // eslint-disable-next-line no-param-reassign
          button.dialog.children[0].children[1].value = markyEditor.element.value.substring(markyEditor.element.selectionStart, markyEditor.element.selectionEnd);
        }
      });
    } else if (buttonName === 'expand') {
      button.listen('click', () => {
        container.classList.toggle('marky-expanded');
        button.toggleClass('marky-expanded');
        markyEditor.toggleClass('marky-expanded');
        button.icon.toggleClass('fa-expand');
        button.icon.toggleClass('fa-compress');
      });
    } else {
      button.listen('click', e => buttonClick(e.currentTarget, buttonName));
    }
  });

  /**
     * Insert elements into the DOM one by one to ensure order
     */

  toolbar.appendTo(container);
  markyEditor.appendTo(container);
  marky.elements.buttons.heading.appendTo(toolbar.element);
  new Separator().appendTo(toolbar.element);
  marky.elements.buttons.bold.appendTo(toolbar.element);
  marky.elements.buttons.italic.appendTo(toolbar.element);
  marky.elements.buttons.strikethrough.appendTo(toolbar.element);
  marky.elements.buttons.code.appendTo(toolbar.element);
  marky.elements.buttons.blockquote.appendTo(toolbar.element);
  new Separator().appendTo(toolbar.element);
  marky.elements.buttons.link.appendTo(toolbar.element);
  marky.elements.buttons.image.appendTo(toolbar.element);
  new Separator().appendTo(toolbar.element);
  marky.elements.buttons.unorderedList.appendTo(toolbar.element);
  marky.elements.buttons.orderedList.appendTo(toolbar.element);
  marky.elements.buttons.outdent.appendTo(toolbar.element);
  marky.elements.buttons.indent.appendTo(toolbar.element);
  new Separator().appendTo(toolbar.element);
  marky.elements.buttons.undo.appendTo(toolbar.element);
  marky.elements.buttons.redo.appendTo(toolbar.element);
  new Separator().appendTo(toolbar.element);
  marky.elements.buttons.expand.appendTo(toolbar.element);
  dialogs.appendTo(toolbar.element);
  marky.elements.dialogs.link.appendTo(dialogs.element);
  marky.elements.dialogs.image.appendTo(dialogs.element);
  marky.elements.dialogs.heading.appendTo(dialogs.element);

  /**
     * Listeners for the editor
     */

  let timeoutID; // Used input events
  let deleteSelection = 0; // Used for determing how to update state with deletions
  const keyMap = []; // Used for determining whether or not to update state on space keyup
  const punctuations = [46, // period
  44, // comma
  63, // question mark
  33, // exclamation point
  58, // colon
  59, // semi-colon
  47, // back slash
  92, // forward slash
  38, // ampersand
  124, // vertical pipe
  32];

  /**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */
  markyEditor.listen('input', () => {
    window.clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => {
      marky.emit('markyupdate');
    }, 1000);
  });

  /**
     * Listen for change events (requires loss of focus) and update state
     */
  markyEditor.listen('change', () => {
    marky.emit('markyupdate');
  });

  /**
     * Listen for pasting into the editor and update state
     */
  markyEditor.listen('paste', () => {
    setTimeout(() => {
      marky.emit('markyupdate');
    }, 0);
  });

  /**
     * Listen for cutting from the editor and update state
     */
  markyEditor.listen('cut', () => {
    setTimeout(() => {
      marky.emit('markyupdate');
    }, 0);
  });

  /**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */
  markyEditor.listen('keydown', e => {
    if (e.which === 8) {
      deleteSelection = e.currentTarget.selectionEnd - e.currentTarget.selectionStart;
    }
  });

  /**
     * Listen for keyup events,
     * if key is space or punctuation (but not a space following punctuation or another space),
     * update state and clear input timeout.
     */
  markyEditor.listen('keypress', e => {
    keyMap.push(e.which);
    if (keyMap.length > 2) keyMap.shift();
    punctuations.forEach(punctuation => {
      // eslint-disable-line consistent-return
      if (e.which === 32 && keyMap[0] === punctuation) {
        return window.clearTimeout(timeoutID);
      }
      if (e.which === punctuation) {
        window.clearTimeout(timeoutID);
        return marky.emit('markyupdate');
      }
    });
  });

  /**
     * Listen for keyup events,
     * if key is delete and it's a bulk selection,
     * update state and clear input timeout.
     */
  markyEditor.listen('keyup', e => {
    if (e.which === 8 && deleteSelection > 0) {
      window.clearTimeout(timeoutID);
      deleteSelection = 0;
      marky.emit('markyupdate');
    }
  });

  markyEditor.listen('click', () => {
    marky.elements.dialogs.image.removeClass('toggled');
    marky.elements.dialogs.link.removeClass('toggled');
    marky.elements.dialogs.heading.removeClass('toggled');
  });

  /**
     * The following just emit a marky event.
     */
  markyEditor.listen('select', () => marky.emit('markyselect'));
  markyEditor.listen('blur', () => marky.emit('markyblur'));
  markyEditor.listen('focus', () => marky.emit('markyfocus'));

  /**
     * Listeners for the marky instance
     */

  marky.on('markyupdate', () => {
    marky.update(markyEditor.element.value, [markyEditor.element.selectionStart, markyEditor.element.selectionEnd], marky.state, marky.index);
  });

  marky.on('markychange', () => {
    if (marky.index === 0) {
      marky.elements.buttons.undo.addClass('disabled');
    } else {
      marky.elements.buttons.undo.removeClass('disabled');
    }
    if (marky.index === marky.state.length - 1) {
      marky.elements.buttons.redo.addClass('disabled');
    } else {
      marky.elements.buttons.redo.removeClass('disabled');
    }

    marky.change(marky.state[marky.index].markdown, marky.state[marky.index].html);
  });

  return marky;
});

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {HTMLCollection}  containers empty elements to initialize marky marked into
 */
function markymark(container = document.getElementsByTagName('marky-mark')) {
  if (container instanceof HTMLElement) {
    return initializer(container);
  }

  if (!(container instanceof Array) && !(container instanceof HTMLCollection) && !(container instanceof NodeList)) {
    throw new TypeError('argument should be an HTMLElement, Array, HTMLCollection');
  }

  return Array.from(container).map(initializer);
}

export default markymark;
