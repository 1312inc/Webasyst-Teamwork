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
            this.caret = app.caret;

            this.tagRegExp = new RegExp("#[\\p{L}]+", "gu");

            // local
            this.ajax = null;
            this.tagsHandleTrigger = '(#|@)';
            this.handleStr = "";
            this.lastTrigger = "";
            this.activeIndex = -1;
        },
        // public
        start: function () {
            if (!this.opts.tagsHandle && !this.opts.mentionsHandle) return;

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

            if ((key === this.keycodes.ENTER || key === this.keycodes.SPACE) && this._isInsideEntity()) {
                e.preventDefault();
            }

            if (key === this.keycodes.SPACE || key === this.keycodes.BACKSPACE) {
                if (this.ajax) {
                    this.ajax.xhr.abort();
                }
            }

            // if (key === this.keycodes.SPACE) {
            //     var $current = this.selection.getCurrent();
            //     if ($current.parentElement.className !== 'redactor-tag') {
            //         var currentText = $current.textContent;
            //         if (this.tagRegExp.test(currentText)) {
            //             $current.textContent = '';
            //             insertionTag = currentText.replace(this.tagRegExp, function (match) {
            //                 return "<span class=\"redactor-tag\">" + match + "</span><span></span>";
            //             });
            //             this.insertion.insertHtml(insertionTag);
            //         }
            //     }
            // }

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



            if (this.caret.isEnd(this.selection.getParent()) && this._isInsideEntity()) {
                if (this.selection.getTextAfterCaret() !== '\u{00A0}') {
                    this.selection.getParent().after('\u{00A0}');
                }
            }

            if (this.caret.isStart(this.selection.getParent()) && this._isInsideEntity()) {
                if (this.selection.getTextBeforeCaret() !== '\u{00A0}') {
                    this.selection.getParent().before('\u{00A0}');
                }
            }

            if (this._isInsideEntity()) {
                if (this.selection.getTextBeforeCaret() === '#' && !this.selection.getTextAfterCaret().trim()) {
                    var $parent = $R.dom(this.selection.getParent());
                    this.caret.setAfter($parent);
                    $R.dom($parent).unwrap();

                }
            }

            if (
                this._isInsideEntity() ||
                arrows.includes(key) ||
                key === this.keycodes.DELETE ||
                key === this.keycodes.ESC ||
                ctrl
            ) {
                return;
            }

            var re = new RegExp("^" + this.tagsHandleTrigger);
            var full_match = this.handleStr = this.selection.getTextBeforeCaret(20).split(/\s+/).pop();

            // detect
            if (
                new RegExp("^" + this.tagsHandleTrigger).test(this.handleStr) &&
                !this.selection.getTextAfterCaret(1).trim()
            ) {
                this.handleStr = this.handleStr.replace(re, "");
                this.lastTrigger = full_match.substr(0, full_match.length - this.handleStr.length);
                this._load();
            } else {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                if (this._isShown()) {
                    this._hide();
                }
            }
        },
        _load: function () {
            var that = this;
            var csrf = document.cookie.match(new RegExp("(?:^|; )_csrf=([^;]*)"));
            if (that.ajax) {
                that.ajax.xhr.abort();
            }
            if (that.timeout) {
                clearTimeout(that.timeout);
            }
            that.timeout = setTimeout(function () {
                that.timeout = null;
                var url = that.lastTrigger == '#' ? that.opts.tagsHandle : that.opts.mentionsHandle;
                if (url) {
                    that.ajax = $R.ajax.post({
                        url: url,
                        data: "term=" + that.handleStr + "&_csrf=" + csrf[1],
                        success: that._parse.bind(that),
                    });
                }
            }, that.opts.tagsHandleDelay || 500);
        },
        _parse: function (json) {
            if (json === "") return;

            var data;
            try {
                data = typeof json === "object" ? json : JSON.parse(json);
            } catch (e) {
                data = [];
            }

            if (this.container.getElement().nodes[0]?.classList.contains('redactor-focus')) {
                this._build();
                this._buildData(data.data);
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
                var img = term.entity_image
                    ? '<img src="' + term.entity_image + '" class="redactor-handle-list-img" />'
                    : '';
                var $item = $R.dom('<a>');
                $item.html(img + term.entity_title);
                $item.attr("data-title", term.entity_title);
                $item.attr("data-type", term.entity_type);
                $item.attr("data-url", term.entity_url);
                $item.attr("data-image", term.entity_image);
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
            this.activeIndex = -1;
            this.lastTrigger = '';
        },
        /**
         * 
         * @param {HTMLElement} e 
         * @returns {void}
         */
        _replace: function (e) {

            var itemData = {
                title: e.dataset.title,
                type: e.dataset.type,
                url: e.dataset.url,
                image: e.dataset.image
            };

            var img = itemData.type === 'tag'
                ? '#'
                : itemData.image
                    ? '<img src="' + itemData.image + '" class="redactor-handle-list-img" />'
                    : '';

            var marker = this.marker.insert("start");
            var $marker = $R.dom(marker);

            var textBefore = marker.previousSibling;
            textBefore.textContent = textBefore.textContent.substring(0, textBefore.textContent.lastIndexOf('#'));

            $marker.before('<font class="redactor-entity redactor-' + itemData.type + '">' + img + itemData.title + '</font>');
            $marker.before('\u{00A0}');

            this.caret.setAfter($marker);
            this.marker.remove();
        },

        _isInsideEntity: function () {
            return this.selection.getCurrent().parentElement.classList.contains('redactor-entity');
        }
    });
})(Redactor);
