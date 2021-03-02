(function($) { "use strict";
    /**
     * Wrapper around jQuery UI autocomplete.
     * Implements a tags autocompletion widget floating over textarea.
     */
    $.fn.textareaAutocomplete = function(options) {
        var last_close_content = '';
        var $textarea = this;
        var timeout = null;
        var local_cache = {};

        $textarea.autocomplete($.extend({}, options, {
            delay: 0, // we implement our own delay
            focus: function(event, ui) {
                return false;
            },
            select: function(event, ui) {
                // Replace tag at cursor with the one user just selected in dropdown
                var content = $textarea.val();
                var cursor_position = $textarea[0].selectionEnd;
                var before_cursor = content.substring(0, cursor_position).replace(/#(\S*)$/, '#'+ui.item.value+' ');
                var after_cursor = content.substring(cursor_position).replace(/^\S+/, '');
                $textarea.val(before_cursor + after_cursor);
                $textarea[0].selectionStart = $textarea[0].selectionEnd = before_cursor.length;
                return false;
            },
            close: function(event, ui) {
                last_close_content = $textarea.val();
            },
            search: function(event, ui) {
                // Only trigger search if something's changed
                return last_close_content != $textarea.val();
            },
            source: function(request, response) {
                // Don't bother unless user started to enter a tag
                var tag = getTag($textarea);
                if (!tag) {
                    return void(response([]));
                }

                // Position the widget just below textarea cursor
                var coordinates = getCaretCoordinates($textarea[0], $textarea[0].selectionEnd);
                $textarea.autocomplete('option', {
                    position: {
                        my: 'left-10 top+5',
                        at: 'left+'+coordinates.left+' top+'+coordinates.bottom,
                        of: $textarea,
                        collision: 'fit'
                    }
                });

                var term = tag.substr(1);
                timeout && clearTimeout(timeout);

                // Is there cached data?
                for(var i = term.length; i >= 0; i--) {
                    var cached = local_cache[term.substr(0, i)];
                    if (cached && cached.is_full) {
                        return void(response(filterResults(cached, term)));
                    }
                }

                // No cached data, make an XHR after a dalay
                timeout = setTimeout(function() {
                    $.post(options.url, { term: term, extended: 1 }, function(r) {
                        if (!r || !r.data) {
                            local_cache[term] = [];
                            local_cache[term].is_full = 1;
                        } else {
                            local_cache[term] = r.data.tags || [];
                            local_cache[term].is_full = r.data.is_full;
                            if (!r.data.is_full) {
                                local_cache[term] = filterResults(local_cache[term], term);
                            }
                        }
                        response(filterResults(local_cache[term], term));
                    }, 'json');
                }, options.delay || 300);
            }
        }));

        // This hack makes autocomplete widget not set the width property of <ul>
        $textarea.data("uiAutocomplete")._resizeMenu = function () {
            this.menu.element[0].style.width = 'auto';
        };

        /**
         * Helper to get caret pixel position.
         * Inspired by: https://github.com/component/textarea-caret-position
         */
        var getCaretCoordinates = (function () {
            var properties = ('direction|boxSizing|width|height|overflowX|overflowY|borderTopWidth|borderRightWidth|borderBottomWidth|borderLeftWidth|'+
                'borderStyle|paddingTop|paddingRight|paddingBottom|paddingLeft|fontStyle|fontVariant|fontWeight|fontStretch|fontSize|'+
                'fontSizeAdjust|lineHeight|fontFamily|textAlign|textTransform|textIndent|textDecoration|letterSpacing|wordSpacing|'+
                'tabSize|MozTabSize').split('|');
            var isFirefox = window.mozInnerScreenX != null;
            return getCaretCoordinates;

            function getCaretCoordinates(textarea, position) {
                var div = document.createElement('div');
                var span = document.createElement('span');
                span.textContent = textarea.value.substring(position) || '.';
                div.textContent = textarea.value.substring(0, position);
                div.appendChild(span);

                var style = div.style;
                var computed = window.getComputedStyle(textarea);
                style.position = 'absolute';
                style.visibility = 'hidden';
                style.wordWrap = 'break-word';
                style.whiteSpace = 'pre-wrap';
                properties.forEach(function (prop) {
                    style[prop] = computed[prop];
                });
                if (!isFirefox) {
                    style.overflow = 'hidden';
                } else if (textarea.scrollHeight > parseInt(computed.height)) {
                    style.overflowY = 'scroll';
                }

                document.body.appendChild(div);
                var coordinates = {
                    top: span.offsetTop + parseInt(computed['borderTopWidth']) - textarea.scrollTop,
                    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
                    height: parseInt(computed.fontSize)
                };
                document.body.removeChild(div);
                coordinates.bottom = coordinates.top + coordinates.height;
                return coordinates;
            }
        })();

        // Helper to get tag name in textarea at cursor
        function getTag($textarea) {
            var content = $textarea.val().substring(0, $textarea[0].selectionEnd);
            var tag = content.match(/#\S*$/);
            if (!tag) {
                return '';
            }
            return tag[0];
        }

        function filterResults(tags, term) {
            return tags.filter(function(tag) {
                return tag.substr(0, term.length) == term;
            }).slice(0, 5);
        }
    };
})(jQuery);
