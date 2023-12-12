(function ($) {
    "use strict";
    /**
     * Wrapper around jQuery UI autocomplete.
     * Implements a tags autocompletion widget floating over textarea.
     */
    $.fn.textareaAutocomplete = function (options) {

        if (!$('#style-autocomplete').length) {
            $('head').append(`<style id="style-autocomplete">.show-ac-message:before{content:"${$.wa?.locale?.wisiwygAutocompleteStartMessage ?? ''}";display:block;position:absolute;top:-16px;left:16px;color:var(--text-color-hint);font-size:10px;white-space:nowrap;}</style>`);
        }
    
        var last_close_content = '';
        var $textarea = this;
        var timeout = null;
        var local_cache = {};
        var lastTrigger = '';

        $textarea.autocomplete($.extend({}, options, {
            delay: 0, // we implement our own delay
            focus: function (event, ui) {
                return false;
            },
            select: function (event, ui) {
                // Replace tag at cursor with the one user just selected in dropdown
                var replacement = ui.item.markdown_code;
                var content = $textarea.val();
                var cursor_position = $textarea[0].selectionEnd;
                var before_cursor = content.substring(0, cursor_position).replace(/(#|@)(\S*)$/, replacement + ' ');
                var after_cursor = content.substring(cursor_position).replace(/^\S+/, '');
                $textarea.val(before_cursor + after_cursor);
                $textarea[0].selectionStart = $textarea[0].selectionEnd = before_cursor.length;
                return false;
            },
            close: function (event, ui) {
                last_close_content = $textarea.val();
            },
            search: function (event, ui) {
                // Only trigger search if something's changed
                return last_close_content != $textarea.val();
            },
            source: function (request, response) {
                // Don't bother unless user started to enter a tag
                var tag = getTag($textarea);
                if (!tag) {
                    return void (response([]));
                }

                // Position the widget just below textarea cursor
                var coordinates = getCaretCoordinates($textarea[0], $textarea[0].selectionEnd);
                $textarea.autocomplete('option', {
                    position: {
                        my: 'left-10 top+5',
                        at: 'left+' + coordinates.left + ' top+' + coordinates.bottom,
                        of: $textarea,
                        collision: 'fit'
                    }
                });

                var term = tag.substr(1);

                var $menu = $($textarea).autocomplete("widget");
                $menu[(!term.length && lastTrigger === '#') ? 'addClass' : 'removeClass']('show-ac-message');

                timeout && clearTimeout(timeout);

                // No cached data, make an XHR after a dalay
                timeout = setTimeout(function () {
                    var taskId = typeof window.Tasks === 'object' ? Object.keys(window.Tasks)[0] : '';
                    $.post(lastTrigger === '@' ? options.urlMention : options.urlEntity, { term: term, task_id: taskId, extended: 1 }, function (r) {
                        local_cache[term] = r.data || [];
                        response(local_cache[term]);
                    }, 'json');
                }, options.delay || 300);
            }
        }));

        // This hack makes autocomplete widget not set the width property of <ul>
        $textarea.data("uiAutocomplete")._resizeMenu = function () {
            this.menu.element[0].style.width = 'auto';
            this.menu.element[0].style['z-index'] = 999999;
        };

        $textarea.data("uiAutocomplete")._renderItem = function (ul, item) {
            var img = item.entity_type === 'tag' ? "#" : item.entity_image
                ? `<span class="icon size-16 custom-mr-4 ${['user', 'contact'].includes(item.entity_type) ? 'userpic' : ''}" style="background-image: url('${item.entity_image}');"></span>`
                : '';
            return $("<li>")
                .append(`<div class="flexbox middle">${img}<span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${item.entity_title}</span></div>`)
                .appendTo(ul);
        };

        /**
         * Helper to get caret pixel position.
         * Inspired by: https://github.com/component/textarea-caret-position
         */
        var getCaretCoordinates = (function () {
            var properties = ('direction|boxSizing|width|height|overflowX|overflowY|borderTopWidth|borderRightWidth|borderBottomWidth|borderLeftWidth|' +
                'borderStyle|paddingTop|paddingRight|paddingBottom|paddingLeft|fontStyle|fontVariant|fontWeight|fontStretch|fontSize|' +
                'fontSizeAdjust|lineHeight|fontFamily|textAlign|textTransform|textIndent|textDecoration|letterSpacing|wordSpacing|' +
                'tabSize|MozTabSize').split('|');
            var isFirefox = window.mozInnerScreenX != null;
            return getCaretCoordinates;

            function getCaretCoordinates (textarea, position) {
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
        function getTag ($textarea) {
            var content = $textarea.val().substring(0, $textarea[0].selectionEnd);
            var tag = content.match(/(#|@)\S*$/);
            if (!tag) {
                return '';
            }
            lastTrigger = tag[1];
            return tag[0];
        }
    };
})(jQuery);
