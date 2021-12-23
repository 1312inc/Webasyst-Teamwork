(function ($R) {
    $R.add("plugin", "watags", {
        init: function (app) {
            this.app = app;
            this.opts = app.opts;
            this.$doc = app.$doc;
            this.$body = app.$body;
            this.editor = app.editor;
            this.marker = app.marker;
            this.keycodes = app.keycodes;
            this.container = app.container;
            this.selection = app.selection;
            this.insertion = app.insertion;

            this.tagRegExp = new RegExp("#[\\p{L}]+", "gu");

            // local
            this.ajax = null
            this.tagsHandleTrigger =
                typeof this.opts.tagsHandleTrigger !== "undefined"
                    ? this.opts.tagsHandleTrigger
                    : "@";
            this.handleStart =
                typeof this.opts.handleStart !== "undefined"
                    ? this.opts.handleStart
                    : 0;
            this.handleStr = "";
            this.handleLen = this.handleStart;

            this.activeIndex = -1;
        },
        // public
        start: function () {
            if (!this.opts.tagsHandle) return;

            var $editor = this.editor.getElement();
            $editor.on("keydown.redactor-plugin-handle", this._navigate.bind(this));
            $editor.on("keyup.redactor-plugin-handle", this._handle.bind(this));
        },
        onmdRendered: function (html) {
            var content = html.replace(this.tagRegExp, function (match) {
                return "<span class=\"redactor-tag\">" + match + "</span><span></span>";
            });
            this.app.source.setCode(content);
        },
        stop: function () {
            var $editor = this.editor.getElement();

            $editor.off(".redactor-plugin-handle");
            this.$doc.off(".redactor-plugin-handle");

            var $list = $R.dom("#redactor-handle-list");
            $list.remove();
        },

        // private
        _navigate: function (e) {
            var key = e.which;
            var arrows = [38, 40]; // up and down

            if (key === this.keycodes.SPACE || key === this.keycodes.BACKSPACE) {
                if (this.ajax) {
                    this.ajax.xhr.abort();
                }
            }

            if (key === this.keycodes.SPACE) {
                var $current = this.selection.getCurrent();
                if ($current.parentElement.className !== 'redactor-tag') {
                    var currentText = $current.textContent;
                    if (this.tagRegExp.test(currentText)) {
                        $current.textContent = '';
                        insertionTag = currentText.replace(this.tagRegExp, function (match) {
                            return "<span class=\"redactor-tag\">" + match + "</span><span></span>";
                        });
                        this.insertion.insertHtml(insertionTag);
                    }
                }
            }

            if (
                (arrows.indexOf(key) !== -1 || key === this.keycodes.ENTER) &&
                this._isShown()
            ) {
                e.preventDefault();

                if (key === this.keycodes.ENTER && this.activeIndex >= 0) {
                    this._replace(this.$list.children().get(this.activeIndex));
                    return;
                }

                if (key === 40) {
                    if (this.activeIndex < this.$list.children().length - 1) {
                        this.activeIndex++;
                    } else {
                        this.activeIndex = -1;
                    }
                }

                if (key === 38) {
                    if (this.activeIndex > -1) {
                        this.activeIndex--;
                    } else {
                        this.activeIndex = this.$list.children().length - 1;
                    }
                }

                this.$list.children().each(function (node) {
                    $R.dom(node).removeClass("active");
                });

                this.$list.children().eq(this.activeIndex).addClass("active");
            }
        },

        _handle: function (e) {
            var key = e.which;
            var ctrl =
                e.key === "Shift" ||
                e.key === "Control" ||
                e.key === "Meta" ||
                e.key === "Alt";
            var arrows = [38, 40];

            if (
                arrows.indexOf(key) !== -1 ||
                key === this.keycodes.DELETE ||
                key === this.keycodes.ESC ||
                ctrl
            ) {
                return;
            }

            var re = new RegExp("^" + this.tagsHandleTrigger);
            this.handleStr = this.selection.getTextBeforeCaret(20).split(/\s+/).pop();

            // detect
            if (
                re.test(this.handleStr) &&
                !this.selection.getTextAfterCaret(1).trim()
            ) {
                this.handleStr = this.handleStr.replace(this.tagsHandleTrigger, "");
                this._load();
            } else {
                if (this._isShown()) {
                    this._hide();
                }
            }
        },
        _load: function () {
            var csrf = document.cookie.match(new RegExp("(?:^|; )_csrf=([^;]*)"));
            if (this.ajax) {
                this.ajax.xhr.abort();
            }
            this.ajax = $R.ajax.post({
                url: this.opts.tagsHandle,
                data: "term=" + this.handleStr + "&_csrf=" + csrf[1],
                success: this._parse.bind(this),
            });
        },
        _parse: function (json) {
            if (json === "") return;

            var data = typeof json === "object" ? json : JSON.parse(json);

            if (this.container.getElement().nodes[0]?.classList.contains('redactor-focus')) {
                this._build();
                this._buildData(data.data.splice(0, 5));
            }
        },
        _build: function () {
            this.$list = $R.dom("#redactor-handle-list");
            if (this.$list.length === 0) {
                this.$list = $R.dom('<div id="redactor-handle-list">');
                this.$body.append(this.$list);
            }
        },
        _buildData: function (data) {
            this.data = data;

            this.activeIndex = -1;
            this._update();
            this._show();
        },
        _update: function () {
            var that = this;

            this.$list.html("");

            for (var term of this.data) {
                var $item = $R.dom('<a href="#">');
                $item.html(term);
                $item.attr("data-key", term);
                $item.on("click", function (e) {
                    e.preventDefault();
                    that._replace(e.target);
                });

                this.$list.append($item);
            }

            // position
            var pos = this.selection.getPosition();

            this.$list.css({
                top: pos.top + pos.height + this.$doc.scrollTop() + "px",
                left: pos.left + "px",
            });
        },
        _isShown: function () {
            return this.$list && this.$list.hasClass("open");
        },
        _show: function () {
            this.$list.addClass("open");
            this.$list.show();

            this.$doc.off(".redactor-plugin-handle");
            this.$doc.on(
                "click.redactor-plugin-handle keydown.redactor-plugin-handle",
                this._hide.bind(this)
            );
        },
        _hide: function (e) {
            var hidable = false;
            var key = e && e.which;

            if (!e) hidable = true;
            else if (
                e.type === "click" ||
                key === this.keycodes.ESC ||
                key === this.keycodes.ENTER ||
                key === this.keycodes.SPACE
            )
                hidable = true;

            if (hidable) {
                this.$list.removeClass("open");
                this.$list.hide();
                this._reset();
            }
        },
        _reset: function () {
            this.handleStr = "";
            this.handleLen = this.handleStart;
            this.activeIndex = -1;
        },
        _replace: function (e) {
            var $item = $R.dom(e);
            var key = $item.attr("data-key");
            var replacement = "<span class=\"redactor-tag\">" + this.tagsHandleTrigger + key + "</span> ";

            var marker = this.marker.insert("start");
            var $marker = $R.dom(marker);
            var current = marker.previousSibling;
            var currentText = current.textContent;
            var re = new RegExp(this.tagsHandleTrigger + this.handleStr + "$");

            currentText = currentText.replace(re, "");
            current.textContent = currentText;

            if (current.parentElement.className === 'redactor-tag') {
                var $node = $R.dom(current.parentElement);
                $node.unwrap();
            }

            $marker.before(replacement);

            this.selection.restoreMarkers();

            return;
        },
    });
})(Redactor);
