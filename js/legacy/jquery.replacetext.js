(function($) { "use strict";
    /**
     * Replaces text down the DOM tree.
     * Accepts parameters like String.prototype.replace:
     *   string|regex `regex`, string|function `replacement`
     * Note that `replacement` is treated as HTML, not plaintext.
     */
    $.fn.replaceText = function(regex, replacement, ignore_tags) {
        ignore_tags = parseIgnoreTags(ignore_tags || 'a|input|button|select|option|textarea|style|script'.split('|'));

        // Put all promising textNodes into toParse array
        // without replacing anything just yet.
        var i, toParse = [];
        for(i = 0; i < this.length; i++) {
            goDeep(this[i]);
        }

        // Process every node in toParse performing replacement.
        var $div = $('<div>');
        for (i = 0; i < toParse.length; i++) {
            $(toParse[i]).replaceWith($.parseHTML($div.text(toParse[i].nodeValue).html().replace(regex, replacement)));
        }
        return this;

        // Helper to look for text nodes and put them into toParse array
        function goDeep(node) {
            var i, c = node.childNodes.length, match;
            for (i = 0; i < c; ++i) {
                var child = node.childNodes[i];
                if (child.nodeType == 3) {
                    match = regex instanceof RegExp && child.nodeValue.match(regex);
                    match = match || typeof regex == 'string' && child.nodeValue.indexOf(regex) >= 0;
                    match && toParse.push(child);
                } else if (!ignore_tags[child.nodeName.toLowerCase()]) {
                    goDeep(child);
                }
            }
        }

        function parseIgnoreTags(tags) {
            var ignore_tags = {};
            tags.forEach(function(t) {
                ignore_tags[t.toLowerCase()] = 1;
            });
            return ignore_tags;
        }
    };
})(jQuery);
