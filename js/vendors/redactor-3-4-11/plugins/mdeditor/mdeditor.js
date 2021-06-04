// define turndown service
var turndownService = new TurndownService();

// add turndown custom rules
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

// define markdown-it
var md = markdownit();
md.set({
  html: true,
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
      var that = this,
        startedContent = this.app.source.getStartedContent();

      setTimeout(function () {
        // set initial HTML in visual layer
        that.app.source.setCode(md.render(startedContent));

        // set initial md in textarea
        that.app.source.getElement().val(startedContent);
      }, 0);
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
  });
})(Redactor);
