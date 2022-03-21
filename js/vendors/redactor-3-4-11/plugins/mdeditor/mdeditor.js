// define turndown service
var turndownService = new TurndownService();

// add turndown custom rules
turndownService.addRule("a", {
  filter: function (node, options) {
    return node.nodeName === "A" && node.getAttribute('href') === node.innerText;
  },
  replacement: function (content) {
    return content.replace(/\\/g, '');
  },
});
turndownService.addRule("pre", {
  filter: ["pre"],
  replacement: function (content) {
    return "```\n" + content + "\n```";
  },
});
turndownService.addRule("code", {
  filter: function (node, options) {
    return node.nodeName === "CODE" && node.parentNode.nodeName !== "PRE";
  },
  replacement: function (content) {
    return "`" + content + "`";
  },
});
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: function (content) {
    return '~~' + content + '~~';
  }
});

// define markdown-it
var md = markdownit();
md.set({
  linkify: true,
});

// Redactor API
(function ($R) {
  $R.add("plugin", "mdeditor", {
    init: function (app) {
      this.app = app;
      this.toolbar = app.toolbar;
    },
    start: function () {
      // set up buttons
      var buttonCode = {
        title: "## code ##",
        icon: true,
        api: "plugin.mdeditor.toggleCode",
      };

      var buttonQuote = {
        title: "## quote ##",
        icon: true,
        api: "module.block.format",
        args: {
          tag: "blockquote",
        },
      };

      // add buttons to the toolbar
      this.toolbar.addButton("html", buttonCode);
      this.toolbar.addButton("quote", buttonQuote);
    },
    onstarted: function () {
      var startedContent = this.app.source.getStartedContent(),
        mdRender = md.render(startedContent);

      // set initial HTML in visual layer
      this.app.source.setCode(mdRender);

      // set initial md in textarea
      this.app.source.getElement().val(startedContent);

      this.app.broadcast('mdRendered', mdRender);
    },
    toggleCode: function () {
      switch (this.app.selection.getElement().nodeName) {
        case "PRE": // clear code block
          this.app.block.format("pre");
          break;
        case "CODE": // clear code string
          this.app.inline.clearFormat();
          break;
        default:
          // string or block selected
          if (this.app.selection.isAll(this.app.selection.getElement())) {
            this.app.block.format("pre");
          } else {
            this.app.inline.format("code");
          }
      }
    },
    onsyncing: function (html) {
      return turndownService.turndown(html);
    },
    onsyncingInverse: function (value) {
      // Synchronization event between textarea and visual layer
      this.app.source.setCode(md.render(value));
      this.app.broadcast('mdRendered', md.render(value));
    },
  });
})(Redactor);
