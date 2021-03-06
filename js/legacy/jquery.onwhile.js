(function($) { "use strict";
    /**
     * Copy of $.fn.on(), with one difference.
     * Additional first argument is expected to be a function. It is called every time event triggers.
     * If this function returns non-true, handler is removed with .off() instead
     * and never called again.
     */
    $.fn.onWhile = function() {
        var $el = this;
        var args = $.makeArray(arguments);

        // First argument is a function that tests for relevance.
        var is_relevant;
        if (typeof args[0] == 'function') {
            is_relevant = args.shift();
        } else {
            return $el;
        }

        // Last argument is a function: event handler.
        var user_handler = args.pop();
        if (typeof user_handler != 'function') {
            return $el;
        }

        // Real handler that checks relevance
        args.push(function() {
            if (!is_relevant.apply($el, arguments)) {
                $el.off.apply($el, args);
                return;
            }
            user_handler.apply(this, arguments);
        });

        return $el.on.apply($el, args);
    };

    /**
     * Same as onWhile, but first argument is a DOM node.
     * Handler is relevant while node is contained within selector element.
     */
    $.fn.onWhileContains = function() {
        var parents = this.get();
        var args = $.makeArray(arguments);
        var node = args.shift();
        args.unshift(function() {
            return parents.some(function(parent) {
                return $.contains(parent, node);
            });
        });
        return this.onWhile.apply(this, args);
    };
})(jQuery);