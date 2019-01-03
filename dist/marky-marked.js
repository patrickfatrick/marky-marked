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

var si = typeof setImmediate === 'function', tick;
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
var contra_9 = contra.emitter;

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
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.floor(Math.random() * 100);
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 36;

  return _createHash(id, _createSalts(n, base), base);
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var marked = createCommonjsModule(function (module, exports) {
(function(root) {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  nptable: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit(block.paragraph)
  .replace('hr', block.hr)
  .replace('heading', block.heading)
  .replace('lheading', block.lheading)
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = edit(block.paragraph)
  .replace('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  .getRegex();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar
 */

block.pedantic = merge({}, block.normal, {
  html: edit(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = Object.create(null);
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.pedantic) {
    this.rules = block.pedantic;
  } else if (this.options.gfm) {
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

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
      loose,
      cap,
      bull,
      b,
      item,
      listStart,
      listItems,
      t,
      space,
      i,
      tag,
      l,
      isordered,
      istask,
      ischecked;

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
          ? rtrim(cap, '\n')
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
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

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
          item.cells[i] = splitCells(item.cells[i], item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
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
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;

      listStart = {
        type: 'list_start',
        ordered: isordered,
        start: isordered ? +bull : '',
        loose: false
      };

      this.tokens.push(listStart);

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      listItems = [];
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

        if (loose) {
          listStart.loose = true;
        }

        // Check for task list items
        istask = /^\[[ xX]\] /.test(item);
        ischecked = undefined;
        if (istask) {
          ischecked = item[1] !== ' ';
          item = item.replace(/^\[[ xX]\] +/, '');
        }

        t = {
          type: 'list_item_start',
          task: istask,
          checked: ischecked,
          loose: loose
        };

        listItems.push(t);
        this.tokens.push(t);

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      if (listStart.loose) {
        l = listItems.length;
        i = 0;
        for (; i < l; i++) {
          listItems[i].loose = true;
        }
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
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/(?: *\| *)?\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

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
          item.cells[i] = splitCells(
            item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
            item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
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
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_|[^\s.])|^_([^\s_][\s\S]*?[^\s])_(?!_|[^\s.])|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  text: /^(`+|[^`])[\s\S]*?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
};

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', block._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: edit(inline.text)
    .replace(']|', '~]|')
    .replace('|$', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|$')
    .getRegex()
});

inline.gfm.url = edit(inline.gfm.url)
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.pedantic) {
    this.rules = inline.pedantic;
  } else if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
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
  var out = '',
      link,
      text,
      href,
      title,
      cap,
      prevCapZero;

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
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      src = src.substring(cap[0].length);
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
      if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = true;
      } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = false;
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
      href = cap[2];
      if (this.options.pedantic) {
        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        } else {
          title = '';
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }
      href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
      out += this.outputLink(cap, {
        href: InlineLexer.escapes(href),
        title: InlineLexer.escapes(title)
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
      out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
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
      if (this.inRawBlock) {
        out += this.renderer.text(cap[0]);
      } else {
        out += this.renderer.text(escape(this.smartypants(cap[0])));
      }
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

InlineLexer.escapes = function(text) {
  return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = link.href,
      title = link.title ? escape(link.title) : null;

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
  var out = '',
      l = text.length,
      i = 0,
      ch;

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
  this.options = options || marked.defaults;
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
      + '</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  if (this.options.headerIds) {
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
  }
  // ignore IDs
  return '<h' + level + '>' + text + '</h' + level + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.checkbox = function(checked) {
  return '<input '
    + (checked ? 'checked="" ' : '')
    + 'disabled="" type="checkbox"'
    + (this.options.xhtml ? ' /' : '')
    + '> ';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  if (body) body = '<tbody>' + body + '</tbody>';

  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + body
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' align="' + flags.align + '">'
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
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }
  var out = '<a href="' + escape(href) + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }

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
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function (text) {
  return text;
};

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
};

TextRenderer.prototype.br = function() {
  return '';
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, {renderer: new TextRenderer()})
  );
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
        unescape(this.inlineText.output(this.token.text)));
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
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
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;

      if (this.token.task) {
        body += this.renderer.checkbox(this.token.checked);
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      // TODO parse inline content if parameter markdown=1
      return this.renderer.html(this.token.text);
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
  if (encode) {
    if (escape.escapeTest.test(html)) {
      return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
    }
  } else {
    if (escape.escapeTestNoEncode.test(html)) {
      return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
    }
  }

  return html;
}

escape.escapeTest = /[&<>"']/;
escape.escapeReplace = /[&<>"']/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
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

function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
      target,
      key;

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

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  var row = tableRow.replace(/\|/g, function (match, offset, str) {
        var escaped = false,
            curr = offset;
        while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
        if (escaped) {
          // odd number of slashes means | is escaped
          // so we leave it alone
          return '|';
        } else {
          // add space before unescaped |
          return ' |';
        }
      }),
      cells = row.split(/ \|/),
      i = 0;

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
  if (str.length === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  var suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < str.length) {
    var currChar = str.charAt(str.length - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, str.length - suffLen);
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

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
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
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

marked.getDefaults = function () {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: new Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tables: true,
    xhtml: false
  };
};

marked.defaults = marked.getDefaults();

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

{
  module.exports = marked;
}
})(commonjsGlobal || (typeof window !== 'undefined' ? window : commonjsGlobal));
});

class Store {
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
    this.index = this.index > num - 1 ? this.index - num : 0;
  }

  /**
   * moves forwardin state
   * @param   {Number} num  the number of states to move forward by
   */
  redo(num) {
    this.index = this.index < this.timeline.length - (num + 1) ? this.index + num : this.timeline.length - 1;
  }
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
 * Creates an array of lines split by line breaks
 * @param   {Number} index optional starting index
 * @returns {String[]}  an array of strings
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
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
 * @param   {String} symbol         the format string to use
 * @returns {Object} the new string, the updated selectionRange
 */
function inlineHandler(string, selectionRange, symbol) {
  let newString = string;
  const newSelectionRange = [...selectionRange];
  // insertSymbols determines whether to add the symbol to either end of the selected text
  // Stat with assuming we will insert them (we will remove as necessary)
  const insertSymbols = [symbol, symbol];
  const symbolLength = symbol.length;
  const relevantPart = string.substring(selectionRange[0] - symbolLength, selectionRange[1] + symbolLength).trim();

  // First check that the symbol is in the string at all
  if (relevantPart.includes(symbol)) {
    // If it is, for each index in the selection range...
    newSelectionRange.forEach((selectionIndex, j) => {
      const isStartingIndex = j === 0;
      const isEndingIndex = j === 1;
      // If the symbol immediately precedes the selection index...
      if (newString.lastIndexOf(symbol, selectionIndex) === selectionIndex - symbolLength) {
        // First trim it
        newString = newString.substring(0, selectionIndex - symbolLength) + newString.substring(selectionIndex);

        // Then adjust the selection range,
        // If this is the starting index in the range, we will have to adjust both
        // starting and ending indices
        if (isStartingIndex) {
          newSelectionRange[0] -= symbolLength;
          newSelectionRange[1] -= symbolLength;
        }

        if (isEndingIndex && !insertSymbols[0]) {
          newSelectionRange[1] -= symbol.length;
        }

        // Finally, disallow the symbol at this end of the selection
        insertSymbols[j] = '';
      }

      // If the symbol immediately follows the selection index...
      if (newString.indexOf(symbol, selectionIndex) === selectionIndex) {
        // Trim it
        newString = newString.substring(0, selectionIndex) + newString.substring(selectionIndex + symbolLength);

        // Then adjust the selection range,
        // If this is the starting index in the range...
        if (isStartingIndex) {
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
        }

        // If this is the ending index and the range
        // AND we're inserting the symbol at the starting index,
        // Adjust the ending selection up
        if (isEndingIndex && insertSymbols[0]) {
          newSelectionRange[1] += symbolLength;
        }

        // Finally, disallow the symbol at this end of the selection
        insertSymbols[j] = '';
      }
    });
  }

  // Put it all together
  const value = newString.substring(0, newSelectionRange[0]) + insertSymbols[0] + newString.substring(newSelectionRange[0], newSelectionRange[1]) + insertSymbols[1] + newString.substring(newSelectionRange[1]);

  return {
    value,
    range: [newSelectionRange[0] + insertSymbols[0].length, newSelectionRange[1] + insertSymbols[1].length]
  };
}

/**
 * Handles adding/removing a format string to a line
 * @param   {String} string         the entire string
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
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
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
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
 * @param   {Number[]}  selectionRange the starting and ending positions to wrap
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
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
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
    this.store = new Store([{
      markdown: '',
      html: '',
      selection: [0, 0]
    }]);
    this.elements = {
      dialogs: {},
      buttons: {},
      editor
    };

    return this;
  }

  get state() {
    return this.store.state;
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
   * @param {String}    markdown  the new markdown blob
   * @param {Number[]}  selection selectionStart and selectionEnd indices
   */
  update(markdown, selection = [0, 0]) {
    this.store.update(markdown, selection);
    this.emit('markychange');
    return this.store.index;
  }

  /**
   * Handles moving backward in state
   * @param   {Number}      num    number of states to move back
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  undo(num = 1, editor = this.editor) {
    this.store.undo(num);
    this.updateEditor(this.store.state.markdown, this.store.state.selection, editor);
    this.emit('markychange');
    return this.store.index;
  }

  /**
   * Handles moving forward in state
   * @param   {Number}      num    number of states to move forward
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  redo(num = 1, editor = this.editor) {
    this.store.redo(num);
    this.updateEditor(this.store.state.markdown, this.store.state.selection, editor);
    this.emit('markychange');
    return this.store.index;
  }

  /**
   * Sets the selection indices in the editor
   * @param   {Number[]}    arr    starting and ending indices
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number[]}    the array that was passed in
   */
  setSelection(arr = [0, 0], editor = this.editor) {
    editor.setSelectionRange(arr[0], arr[1]);
    return arr;
  }

  /**
   * expands the selection to the right
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number[]}    the new selection indices
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
   * @returns {Number[]}    the new selection indices
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
   * @returns {Number}      the new cursor position
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
   * @returns {Number}      the new cursor position
   */
  moveCursorForward(num = 0, editor = this.editor) {
    const start = editor.selectionStart + num;

    editor.setSelectionRange(start, start);
    return start;
  }

  /**
   * implements a bold on a selection
   * @requires handlers/inlineHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the bold
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the italic
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the strikethrough
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the code
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the bold
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the heading
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the snippet is inserted
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the snippet is inserted
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the list is implemented
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the list is implemented
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the indent is implemented
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
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the outdent is implemented
   */
  outdent(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const indentify = indentHandler(editor.value, indices, 'out');
    this.updateEditor(indentify.value, indentify.range, editor);
    this.emit('markyupdate');
    return [indentify.range[0], indentify.range[1]];
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
 * @param {String} type   tag name for the element
 * @param {String} id     editor ID to associate with the element
 * @param {Object} props  props to assign to the element
 */
class Element {
  constructor(type, props = {}) {
    this.type = type;
    this.element = this.create();
    this.listeners = {};
    Object.entries(props).forEach(([prop, value]) => {
      this.assign(prop, value);
    });
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

  /**
   * @param {Element} element an instance of Element
   */
  appendToElement(element) {
    element.element.appendChild(this.element);

    return this;
  }

  /**
   * @param {Element[]} elements an array of elements
   */
  appendElements(elements) {
    elements.forEach(element => this.element.appendChild(element.element));

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
 * @param {String[]} classNames classes to use with element
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
 * @param {String[]}      iconClasses      classes to use for <i> elements
 */
class Button extends Element {
  constructor(id, title, ...iconClasses) {
    super('button', { title, value: title, type: 'button' });
    this.addClass(title, id);

    this.icon = new Icon(...iconClasses).appendToElement(this);
  }
}

/**
 * Creates dialog elements
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class Dialog extends Element {
  constructor(id, title) {
    super('div', { title });
    this.addClass(id, title, 'dialog');
  }
}

/**
 * Creates dialog (modal) elements
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class LinkDialog extends Dialog {
  constructor(id) {
    super(id, 'Link Dialog');

    this.form = new Element('form', {
      id: `${id}-link-form`,
      title: 'Link Form'
    }).appendToElement(this);

    this.urlInput = new Element('input', {
      type: 'text',
      name: `${id}-link-url-input`,
      placeholder: 'http://url.com',
      title: 'Link Url'
    }).addClass('link-url-input');

    this.nameInput = new Element('input', {
      type: 'text',
      name: `${id}-link-display-input`,
      placeholder: 'Display text',
      title: 'Link Display'
    }).addClass('link-display-input');

    this.insertButton = new Element('button', {
      type: 'submit',
      textContent: 'Insert',
      title: 'Insert Link'
    }).addClass('insert-link');

    this.form.appendElements([this.urlInput, this.nameInput, this.insertButton]);
  }
}

/**
 * Creates image dialog modal
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
class ImageDialog extends Dialog {
  constructor(id) {
    super(id, 'Image Dialog');

    this.form = new Element('form', { id: `${id}-image-form`, title: 'Image Form' }).appendToElement(this);

    this.urlInput = new Element('input', {
      type: 'text',
      name: `${id}-image-source-input`,
      placeholder: 'http://url.com/image.jpg',
      title: 'Image Source'
    }).addClass('image-source-input');

    this.nameInput = new Element('input', {
      type: 'text',
      name: `${id}-image-alt-input`,
      placeholder: 'Alt text',
      title: 'Image Alt'
    }).addClass('image-alt-input');

    this.insertButton = new Element('button', {
      type: 'submit',
      textContent: 'Insert',
      title: 'Insert Image'
    }).addClass('insert-image');

    this.form.appendElements([this.urlInput, this.nameInput, this.insertButton]);
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
    super('li', { title, value });
    this.addClass(title);

    this.button = new Element('button', { type: 'button', value }).addClass('heading-button', title).appendToElement(this);

    if (iconClasses.length) {
      this.icon = new Icon(...iconClasses).appendToElement(this.button);
    } else {
      this.button.assign('textContent', value);
    }
  }
}

/**
 * Creates heading dialog element
 * @type {Dialog}
 * @param {String}      id      editor ID to associate with the element
 * @param {String}      title   title for the element
 */
class HeadingDialog extends Dialog {
  constructor(id) {
    super(id, 'Heading Dialog');

    this.headingList = new Element('ul', { title: 'Heading List' }).addClass(`${id}-heading-list`).appendToElement(this);

    this.options = [...Array(6)].map((_, i) => new HeadingItem(`Heading ${i + 1}`, i + 1));
    this.options.push(new HeadingItem('Remove Heading', 0, 'fa', 'fa-remove'));

    this.options.forEach(option => {
      option.appendToElement(this.headingList);
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

  const toolbar = new Element('div', { title: 'Toolbar' }).addClass('marky-toolbar', id);
  const dialogs = new Element('div', { title: 'Dialogs' }).addClass('marky-dialogs', id);
  const markyEditor = new Element('textarea', { title: 'Marky Marked Editor' }).addClass('marky-editor', id);

  const marky = contra_9(new Marky(id, container, markyEditor));
  container.marky = marky; // eslint-disable-line no-param-reassign

  /**
     * Create and register dialogs and set listeners
     */

  marky.elements.dialogs = {
    heading: new HeadingDialog(id),
    link: new LinkDialog(id),
    image: new ImageDialog(id)
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
    console.log(markyEditor.element.selectionStart, markyEditor.element.selectionEnd);
    if (button.classList.contains('disabled')) return;
    if (['undo', 'redo'].includes(name)) {
      marky[name]();
    } else {
      marky[name]([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    }
  }

  marky.elements.buttons = {
    heading: new Button(id, 'Heading', 'fa', 'fa-header').addClass('marky-border-left', 'marky-border-right'),
    bold: new Button(id, 'Bold', 'fa', 'fa-bold').addClass('marky-border-left'),
    italic: new Button(id, 'Italic', 'fa', 'fa-italic'),
    strikethrough: new Button(id, 'Strikethrough', 'fa', 'fa-strikethrough'),
    code: new Button(id, 'Code', 'fa', 'fa-code'),
    blockquote: new Button(id, 'Blockquote', 'fa', 'fa-quote-right').addClass('marky-border-right'),
    link: new Button(id, 'Link', 'fa', 'fa-link').addClass('marky-border-left'),
    image: new Button(id, 'Image', 'fa', 'fa-file-image-o').addClass('marky-border-right'),
    unorderedList: new Button(id, 'Unordered List', 'fa', 'fa-list-ul').addClass('marky-border-left'),
    orderedList: new Button(id, 'Ordered List', 'fa', 'fa-list-ol'),
    outdent: new Button(id, 'Outdent', 'fa', 'fa-outdent'),
    indent: new Button(id, 'Indent', 'fa', 'fa-indent').addClass('marky-border-right'),
    undo: new Button(id, 'Undo', 'fa', 'fa-backward').addClass('marky-border-left'),
    redo: new Button(id, 'Redo', 'fa', 'fa-forward').addClass('marky-border-right'),
    expand: new Button(id, 'Expand', 'fa', 'fa-expand').addClass('marky-border-left', 'marky-border-right')
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
  toolbar.appendElements([marky.elements.buttons.heading, new Separator(), marky.elements.buttons.bold, marky.elements.buttons.italic, marky.elements.buttons.strikethrough, marky.elements.buttons.code, marky.elements.buttons.blockquote, new Separator(), marky.elements.buttons.link, marky.elements.buttons.image, new Separator(), marky.elements.buttons.unorderedList, marky.elements.buttons.orderedList, marky.elements.buttons.outdent, marky.elements.buttons.indent, new Separator(), marky.elements.buttons.undo, marky.elements.buttons.redo, new Separator(), marky.elements.buttons.expand, dialogs]);
  dialogs.appendElements([marky.elements.dialogs.link, marky.elements.dialogs.image, marky.elements.dialogs.heading]);

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
    marky.update(markyEditor.element.value, [markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
  });

  marky.on('markychange', () => {
    if (marky.store.index === 0) {
      marky.elements.buttons.undo.addClass('disabled');
    } else {
      marky.elements.buttons.undo.removeClass('disabled');
    }
    if (marky.store.index === marky.store.timeline.length - 1) {
      marky.elements.buttons.redo.addClass('disabled');
    } else {
      marky.elements.buttons.redo.removeClass('disabled');
    }
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
