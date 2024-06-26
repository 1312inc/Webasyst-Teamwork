(function ($R) {

    function escapeRegExp (string) {
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
            reHasRegExpChar = RegExp(reRegExpChar.source);
        
        return (string && reHasRegExpChar.test(string))
            ? string.replace(reRegExpChar, '\\$&')
            : string;
    }

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

            // local
            this.tagRegExp = new RegExp("#[a-zA-Z0-9_.-]+", "gu");
            this.taskLinks = window.taskLinks;
            this.ajax = null;
            this.spinner = null;
            this.handleStr = "";
            this.lastTrigger = "";
            this.activeIndex = -1;
            this.pasteMode = false;
        },
        // public
        start: function () {
            if (!this.opts.tagsHandle && !this.opts.mentionsHandle) return;

            var $editor = this.editor.getElement();
            $editor.on("keydown.redactor-plugin-handle", this._navigate.bind(this));
            $editor.on("keyup.redactor-plugin-handle", (e) => {
                if (this.showTimeout) {
                    clearTimeout(this.showTimeout);
                }
                if (this._isShown()) {
                    this._handle(e);
                } else {
                    this.showTimeout = setTimeout(() => {
                        this.showTimeout = null;
                        this._handle(e);
                    }, 600);
                }
            });

            /**
             * Trigger Autocomplete Demo
             */
            $R.dom(".t-form-line-autocomplete-chip").on('mousedown', (e) => {
                // only left mouse button
                if (e.buttons === 1) {

                    var isStart = this.caret.isStart();
                    var isFocus = this.editor.isFocus();
                    var isEmpty = this.editor.isEmpty();

                    if (isStart) {
                        if (isEmpty) {
                            this.app.offset.set({ start: 0, end: 0 });
                        } else if (!isFocus) {
                            this.caret.setEnd($editor);
                        }
                    }

                    var char = $R.dom(e.currentTarget).data('type') === 'at' ? '@' : '#';
                    var marker = this.marker.insert("start");
                    var $marker = $R.dom(marker);
                    var oldOffset = this.app.offset.get();

                    setTimeout(() => {
                        this.editor.focus();
                        $marker.after(' ' + char + ' ');
                        if (isStart && isEmpty) {
                            this.marker.remove();
                        }
                        this.app.offset.set({ start: oldOffset.start + 2, end: oldOffset.end + 2 });
                        this.marker.remove();
                        $editor.trigger('keyup');
                    }, 100);
                }
            });
        },
        onmdRendered: function (html) {
            var content = html;
            for (var k in this.taskLinks) {
                var link = this.taskLinks[k];
                var isSpan = ['tag', 'user', 'task'].includes(link.entity_type);
                var $icon = link.entity_type === 'tag' ? '#' : `<i class="icon size-16 userpic custom-mr-4" data-redactor-style-cache="background-image: url(${link.entity_image})" style="background-image: url(${link.entity_image});${!['user', 'contact'].includes(link.entity_type) ? 'border-radius:0;' : ''}"></i>`;
                var replacement = `<a href="${link.entity_url}" class="redactor-entity redactor-entity--${link.entity_type === 'tag' ? 'tag' : 'link'} ${isSpan ? 'redactor-entity--raw' : ''}" contenteditable=\"false\" target="_blank">${$icon}${link.entity_link_name}</a>\uFEFF`;
                var target = `<a href="${link.entity_url}">${link.entity_link_name}</a>`;
                var re = new RegExp([target, k].filter(e => typeof e === 'string').map(e => escapeRegExp(e)).join("|"),"gi");
                content = content.replaceAll(re, replacement);
            }
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

            if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
                this.pasteMode = true;
            }

            if (key === this.keycodes.SPACE || key === this.keycodes.BACKSPACE) {
                if (this.ajax) {
                    this.ajax.xhr.abort();
                }
            }

            if (key === this.keycodes.SPACE) {
                var $current = this.selection.getCurrent();
                if ($current.parentElement.className !== 'redactor-entity') {
                    var currentText = $current.textContent;
                    if (this.tagRegExp.test(currentText)) {
                        $current.textContent = '';
                        insertionTag = currentText.replace(this.tagRegExp, function (match) {
                            return `<a class="redactor-entity redactor-entity--tag redactor-entity--raw" contenteditable="false">${match}</a>`;
                        });
                        this.insertion.insertHtml((/\S/.test(this.selection.getTextBeforeCaret()) ? ' ' : '') + insertionTag + (/\S/.test(this.selection.getTextAfterCaret()) ? ' ' : ''));
                        return;
                    }
                }
            }

            if (
                ([38, 40].indexOf(key) !== -1 || key === this.keycodes.ENTER) &&
                this._isShown()
            ) {
                e.preventDefault();

                var children = this.$list.children('[data-type]');

                if (key === this.keycodes.ENTER && this.activeIndex >= 0) {
                    this._replace(children.get(this.activeIndex));
                    return;
                }

                if (key === 40) {
                    if (this.activeIndex < children.length - 1) {
                        this.activeIndex++;
                    } else {
                        this.activeIndex = -1;
                    }
                }

                if (key === 38) {
                    if (this.activeIndex > -1) {
                        this.activeIndex--;
                    } else {
                        this.activeIndex = children.length - 1;
                    }
                }

                children.each(function (node) {
                    $R.dom(node).removeClass("active");
                });

                children.eq(this.activeIndex).addClass("active");
            }
        },

        _handle: function (e) {
            var key = e.which;
            var ctrl =
                e.key === "Shift" ||
                e.key === "Control" ||
                e.key === "Meta" ||
                e.key === "Alt";
            
            if (
                [38, 40].includes(key) ||
                key === this.keycodes.DELETE ||
                key === this.keycodes.ESC ||
                (ctrl && !this.pasteMode)
            ) {
                return;
            }

            this.pasteMode = false

            var re = new RegExp("^(#|@)");
            var full_match = this.handleStr = this.selection.getTextBeforeCaret(20).replace(/(#|@)\uFEFF+/gm, "$1").split(/\s+/).pop();
            var range = this.selection.getRange();

            // detect
            if (
                re.test(this.handleStr) &&
                !(/\S/.test(this.selection.getTextAfterCaret())) &&
                (range.endOffset !== 0 && range.endContainer.nodeName === '#text')
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

            this._build();
            this._buildData([]);

            // add Spinner
            that.spinner = $R.dom(`<div class="gray custom-m-8">${$.wa?.locale ? ($.wa.locale['Loading...'] ?? 'Loading...') : 'Loading...'}</div>`);
            if (that.$list && that.$list.length) {
                if (!that.$list.children('.spinner').length) {
                    that.$list.prepend(that.spinner);
                }
            }

            if (that.ajax) {
                that.ajax.xhr.abort();
            }
            if (that.timeout) {
                clearTimeout(that.timeout);
            }
            that.timeout = setTimeout(function () {
                that.timeout = null;
                var url = that.lastTrigger === '#' ? that.opts.tagsHandle : that.opts.mentionsHandle;
                if (url) {
                    var taskId = typeof window.Tasks === 'object' ? Object.keys(window.Tasks)[0] : '';
                    that.ajax = $R.ajax.post({
                        url: url,
                        data: "task_id=" + taskId + "&term=" + that.handleStr + "&_csrf=" + csrf[1],
                        success: function (data) {
                            that._parse(data);
                            that.spinner.remove();
                        },
                        error: function () {
                            that.spinner.remove();
                        }
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

            this._buildData(data.data);
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

            that.$list.html("");

            if (!that.handleStr && that.lastTrigger === '#') {
                if ($.wa?.locale) {
                    that.$list.append(`<div class="hint custom-m-8">${$.wa.locale.wisiwygAutocompleteStartMessage}</div>`);
                }
            }

            for (var term of that.data) {
                var img = term.entity_type === 'tag' ? "#" : term.entity_image
                    ? `<img src="${term.entity_image}" class="custom-mr-4 redactor-handle-list-img ${['user', 'contact'].includes(term.entity_type) ? 'redactor-handle-list-img--rounded' : ''}" />`
                    : '';
                var $item = $R.dom('<a>');
                $item.html(img + '<span>' + term.entity_title + '</span>');
                $item.attr("data-title", term.entity_title);
                $item.attr("data-type", term.entity_type);
                $item.attr("data-url", term.entity_url);
                $item.attr("data-image", term.entity_image);
                $item.attr("data-link_name", term.entity_link_name);
                $item.on("mousedown", function (e) {
                    e.preventDefault();
                    that._replace($(this)[0]);
                });

                that.$list.append($item);
            }

            // position
            var pos = that.selection.getPosition();

            that.$list.css({
                top: pos.top + pos.height + that.$doc.scrollTop() + "px",
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
                link_name: e.dataset.link_name,
                type: e.dataset.type,
                url: e.dataset.url,
                image: e.dataset.image
            };

            var marker = this.marker.insert("start");
            var $marker = $R.dom(marker);
            var textBefore = marker.previousSibling;
            textBefore.textContent = textBefore.textContent.substring(0, textBefore.textContent.lastIndexOf(this.lastTrigger));

            // remove extra trigger char after paste
            var sibling = previousSiblingWithTrigger(marker);
            if (sibling) {
                sibling.textContent = sibling.textContent.substring(0, sibling.textContent.length - 1);
            }

            var isSpan = ['tag', 'user', 'task'].includes(itemData.type);
            var $container = $R.dom('<a href=' + itemData.url + ' target="_blank">');
            $container.addClass('redactor-entity redactor-entity--' + (itemData.type === 'tag' ? 'tag' : 'link'));
            $container.addClass(isSpan ? 'redactor-entity--raw' : '');
            $container.attr('contenteditable', false);
            var $icon = itemData.type === 'tag' ? '#' : `<i class="icon size-16 userpic custom-mr-4" data-redactor-style-cache="background-image: url(${itemData.image})" style="background-image: url(${itemData.image});${!['user', 'contact'].includes(itemData.type) ? 'border-radius:0;' : ''}"></i>`;
            $container.html($icon + itemData.link_name);

            $marker.before($container);
            $marker.before(' ');

            this.caret.setAfter($marker);
            this.marker.remove();

            function previousSiblingWithTrigger (el) {
                var prev = el.previousSibling;
                if (prev) {
                    if (/(#|@)$/.test(prev.textContent)) {
                        return prev;
                    } else {
                        return previousSiblingWithTrigger(prev);
                    }
                } else {
                    return undefined;
                }
            }
        }
    });
})(Redactor);
