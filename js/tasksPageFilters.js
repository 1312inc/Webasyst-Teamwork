// Definition of Filter Types (Classes)
var TasksFilterSelector;
var TasksHashFilterSelector;
var TasksTagCloudFilterSelector;

(function ($) { "use strict";

    // <PRIVATE HELPERS SECTION>

    var clone = function (o) {
        return $.extend(true, {}, o);
    };

    var typecastValue = function (value, decodeStringValue) {
        var int = parseInt(value, 10);
        if (!isNaN(int)) {
            return int;
        }
        if (typeof value === 'string') {
            value = $.tasks.trim(value) || '';
            return decodeStringValue ? decodeURIComponent(value) : value;
        }
        return '';
    };

    var parseContextString = function (conditions) {

        var context = {},
            ops = new RegExp(/(\$=|\^=|\*=|==|!=|>=|<=|=|>|<)/),
            parts = (conditions || '').split('&');

        $.each(parts, function (index, expr) {
            expr = expr.split(ops);
            if (expr[0] === 'hash') {
                context[expr[0]] = expr[2];
            } else {
                context[expr[0]] = {
                    op: expr[1],
                    val: typecastValue(expr[2], true)
                };
            }
        });

        context.hash = context.hash || '';
        context.hash = $.tasks.trim(context.hash, '/');
        if (context.hash.length) {
            context.hash = context.hash.split('/');
            if (context.hash.length > 1) {
                context.hash[1] = typecastValue(context.hash[1], true);
            }
        } else {
            delete context.hash;
        }

        return context;
    };

    var buildContextString = function (context) {

        context = clone(context);

        var hash = '';
        context.hash = context.hash || [];
        if (context.hash.length > 0) {
            hash = context.hash.join('/');
        }
        delete context.hash;

        var parts = [];

        $.each(context, function (k, item) {
            if (item.val || item.val === 0) {
                parts.push(k + (item.op || '=') + item.val);
            }
        });

        if (parts.length > 0) {
            parts.push('hash=' + hash);
        } else {
            parts.push(hash);
        }

        parts = parts.join('&');

        if (parts.length > 0) {
            return '#/tasks/' + parts + '/';
        } else {
            return '#/tasks/';
        }
    };

    var setContextParam = function (context, key, op, val) {
        context[key] = context[key] || {};
        context[key].op = op || '=';
        context[key].val = val;
    };

    var unsetContextParam = function (context, key) {
        if (!$.isEmptyObject(context) && !$.isEmptyObject(context[key])) {
            delete context[key];
        }
    };

    var areMapsEquals = function (m1, m2) {
        var mapKeys = function (o) {
            var ks = [];
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    ks.push(k);
                }
            }
            return ks;
        };
        var isMap = function (m) {
            return $.isArray(m) || $.isPlainObject(m);
        };
        var areEquals = function (m1, m2) {
            var keys1 = mapKeys(m1),
                keys2 = mapKeys(m2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (var i = 0; i < keys1.length; i++) {
                var k = keys1[i];
                if (isMap(m1[k]) && isMap(m2[k])) {
                    if (!areEquals(m1[k], m2[k])) {
                        return false;
                    }
                } else if ($.isNumeric(m1[k]) && $.isNumeric(m2[k])) {
                    if (parseInt(m1[k], 10) !== parseInt(m2[k], 10)) {
                        return false;
                    }
                } else if (m1[k] !== m2[k]) {
                    return false;
                }
            }
            return true;
        };
        return areEquals(m1, m2);
    };

    var getPageContext = function () {
        var hash = $.tasks.cleanHash(window.location.hash) || '';
        hash = (hash || '').replace('#/tasks/', '');
        hash = $.tasks.trim(hash, '/');
        if (hash.indexOf('hash=') < 0) {
            hash = 'hash=' + hash;
        }
        return parseContextString(hash);
    };

    /**
     * Here is transformation logic helper for TasksFilterSelector,TasksTagCloudFilterSelector
     * Transform context by applying params
     * @param {Object} params
     * @param {Object} context
     * @returns {Object} New context
     */
    var transformContext = function (params, context) {

        params = params || {};

        // unpack params

        var hash  = params.hash  || '',
            id    = params.id    || '',
            op    = params.op    || '=',
            value = params.value || params.value === 0 ? params.value : '';

        // Understand "hash notation" AND there is CORRESPONDED hash in url
        if (hash.length && context.hash && context.hash[0] === hash) {
            if (value || value === 0) {
                context.hash[1] = value;
            } else {
                delete context.hash;
            }
            return context;
        }

        // Work with "param notation"
        if (value || value === 0) {
            setContextParam(context, id, op, value);
        } else {
            unsetContextParam(context, id);
        }
        return context;
    };

    // </PRIVATE HELPERS SECTION>

    // <FILTERS CLASSES DECLARATIONS>

    TasksFilterSelector = (function($) {
        /***
         * @param $element
         * @param {Object} options
         *   {Function} options.onSelect
         */
        TasksFilterSelector = function ($element, options) {

            options = options || {};

            //
            // Clarification note
            //
            // Maybe two kind of notation of current filter
            // First  - "hash notation"  (examples: status/1, hash=status/1, milestone/NULL, hash=milestone/NULL,...)
            // Second - "param notation" (examples: status_id=1, milestone_id==NULL,...)
            //
            // Filter widget may understand OR not hash notation
            // If understand, widget must has 'hash' property (see before)
            // If not, widget must not has 'hash' property
            // Filter must always has 'id' property
            //
            // If filter widget understand "hash notation" it must may substitute CORRESPONDED hash in url
            // Example: status/1 -> status/2, OR status/1 -> hash=status/2
            // If url has NOT CORRESPONDED hash, filter widget must not touch it
            // Example: project/1 -> project/1, OR project/1 -> hash=project/1
            //
            // If filter widget doesn't understand "hash notation" OR url has NOT CORRESPONDED hash
            // than filter changes only CORRESPONDED param in url
            // Example: status_id=1 -> status_id=2
            // Example: milestone_id=1 -> milestone_id==NULL
            // Example: project/1&status_id=1 -> project/1&status_id=2, OR status_id=2&hash=project/1
            //
            // Only we work with context ({Object}) instead of url ({String})
            // For our own convenient
            //

            // Drop down widget
            var menu = new TasksDropDownMenu($element);

            // Widget must always has ID
            var id = menu.getInfo('id') || '';

            // Widget may has or not HASH. If widget has HASH, than means widget understand "hash notation"
            var hash = menu.getInfo('hash') || '';

            // For our own convenient we work with {Object} context instead of url ({String})
            var current_context = getPageContext();

            var transform = function (context, value, op) {
                var params = { id: id, hash: hash, value: value, op: op };
                return transformContext(params, context);
            };

            // For each option in selector build link and check is this option must be selected
            menu.eachOption(function (value, option) {

                // clone to prevent current_context var mutation
                var context = clone(current_context);

                // so, context if transformed
                context = transform(context, value, option.op);

                // {Object} context -> {String} url
                var link = buildContextString(context);

                // set link for option in selector
                menu.updateOption(value, 'link', link);

                // select option if contexts are equals
                if (areMapsEquals(context, current_context)) {
                    menu.setSelected(value);
                }
            });

            // Callback binding
            if (typeof options.onSelect === 'function') {
                menu.onSelect(options.onSelect);
            }

            // prepare instance itself
            var that = this;

            that.id = id;
            that.hash = hash;
            that.menu = menu;
            that.$element = $element;
            that.notations = {
                'param': true,
                'hash': !!hash.length
            };

            $element.data('pageFilter', that);
        };

        // converter from input hash to param structure { id => <id>, op => '<op>', val => 'val' }
        TasksFilterSelector.prototype.convert = function (context_hash) {

            var that = this,
                hash = that.hash;

            // not hash notification supported
            if (!hash.length) {
                return null;
            }

            // bad input
            if (!$.isArray(context_hash) || !context_hash.length) {
                return null;
            }
            // hash types aren't match
            if (context_hash[0] !== hash) {
                return null;
            }
            // hash value is 'empty', works only with correct 2-part hashes
            // Examples: 'status/0', 'project/1', 'milestone/NULL' ('NULL' - is string literal here)
            if (!context_hash[1] && context_hash[1] !== 0) {
                return null;
            }

            // search by values matching, if found - here is out structure
            var res = null,
                id = that.id;
            that.menu.eachOption(function (value, option) {
                if (value !== context_hash[1]) {
                    return;
                }
                res = {
                    id: id,
                    op: option.op,
                    value: value
                };
                return false;
            });
            return res;
        };

        TasksFilterSelector.prototype.getTitlePartForHeader = function () {
            var that = this;
            var info = that.menu.getSelected();
            if (info.value || info.value === 0) {
                return $.trim(info.name || '');
            }
            return '';
        };

        TasksFilterSelector.prototype.getDescriptionPartForHeader = function () {
            var that = this;
            var info = that.menu.getSelected();
            if (info.description) {
                return $.trim(info.description || '');
            }
            return '';
        };

        return TasksFilterSelector;

    })(jQuery);

    TasksHashFilterSelector = (function ($) {
        /**
         * @param $element
         * @param {Object} options
         *   {Function} options.convert
         *   {Function} options.onSelect
         * @constructor
         */
        TasksHashFilterSelector = function ($element, options) {

            options = options || {};

            //
            // Clarification note
            //
            // It's can work only with "hash notation"
            // "Param notation" doesn't work
            //
            // Furthermore any hash of current context must be converted to proper filter param
            // or replaced with new hash
            //
            // This filter selector is kind of hash monopolist:)
            //

            // Drop down widget
            var menu = new TasksDropDownMenu($element);

            // For our own convenient we work with {Object} context instead of url ({String})
            var current_context = getPageContext();

            // covert method
            var convert = typeof options.convert === 'function' ? options.convert : null;

            // Here is transformation logic helper
            var transform = function (context, value) {

                // try to convert prev hash to filter param notation
                var res = convert && convert(context.hash);
                if (res) {
                    setContextParam(context, res.id, res.op, res.value);
                }

                // set current hash
                if (value) {
                    context.hash = [value];
                } else {
                    delete context.hash;
                }

                return context;
            };

            menu.eachOption(function (value, option) {

                // clone to prevent current_context var mutation
                var context = clone(current_context);

                // so, context if transformed
                context = transform(context, value, option.op);

                // {Object} context -> {String} url
                var link = buildContextString(context);

                // set link for option in selector
                menu.updateOption(value, 'link', link);

                // select option if contexts are equals
                if (areMapsEquals(context, current_context)) {
                    menu.setSelected(value);
                }

            });

            // Callback binding
            if (typeof options.onSelect === 'function') {
                menu.onSelect(options.onSelect);
            }

            // prepare instance itself
            var that = this;
            that.menu = menu;
            that.$element = $element;
            that.notations = {
                'hash': true
            };

            $element.data('pageFilter', that);
        };

        TasksHashFilterSelector.prototype.getTitlePartForHeader = function () {
            var that = this;
            var info = that.menu.getSelected();
            if (info.value || info.value === 0) {
                return $.trim(info.name || '');
            }
            return '';
        };

        return TasksHashFilterSelector;

    })(jQuery);

    TasksTagCloudFilterSelector = (function ($) {

        // PRIVATE VARS
        var id,
            hash,
            $tag_links,
            $input;

        TasksTagCloudFilterSelector = function ($element, options) {

            options = options || {};

            // Widget must always has ID
            id = $element.data('id') || '';

            // Widget may has or not HASH. If widget has HASH, than means widget understand "hash notation"
            hash = $element.data('hash') || '';

            // cloud links
            $tag_links = $element.find('.js-tag-link');

            // autocomplete input
            $input = $element.find('.js-t-header-tags-autocomplete');

            // For our own convenient we work with {Object} context instead of url ({String})
            var current_context = getPageContext();

            // helper
            var transform = function (context, value) {
                var params = { id: id, hash: hash, value: value };
                return transformContext(params, context);
            };

            // callback
            var onSelect = typeof options.onSelect === 'function' ? options.onSelect : null;

            // For each tag link build link and check is this link currently clicked
            $tag_links.each(function () {

                // current link
                var $link = $(this),
                    value = $link.data('value');

                // clone to prevent current_context var mutation
                var context = clone(current_context);

                // so, context if transformed
                context = transform(context, value);

                // {Object} context -> {String} url
                var link = buildContextString(context);

                // set link for current tag
                $link.attr('href', link);

                // bind event
                $link.on('click', function (event) {
                    onSelect && onSelect.apply(this, [event]);
                });
            });



            // init autocomplete input
            $input.autocomplete({
                source: '?module=tags&action=autocomplete',
                minLength: 1,
                delay: 300,
                select: function (event, ui) {
                    // clone to prevent current_context var mutation
                    var context = clone(current_context);

                    // so, context if transformed
                    context = transform(context, ui.item.label);

                    // {Object} context -> {String} url
                    var link = buildContextString(context);

                    $.wa.setHash(link);

                    onSelect && onSelect.apply(this, [event, ui]);

                    return false;
                }
            });

            // set title
            var title = $element.find('.js-title').data('defaultTitle') || '';
            if ($.isArray(current_context.hash) && current_context.hash[0] === hash) {
                title = current_context.hash[1];
                $('.js-show-all').show();
                $('.js-tag-link[data-value="'+current_context.hash[1]+'"]').addClass('t-tag-selected');
                $('.js-tags-wrapper a').removeClass('t-tag-selected');
                $('.js-tags-wrapper a[data-value="'+current_context.hash[1]+'"]').addClass('t-tag-selected');
            } else if ($.isPlainObject(current_context[id]) && (current_context[id].val || current_context[id].val === 0)) {
                title = current_context[id].val;
                $('.js-show-all').show();
                $('.js-tag-link[data-value="'+current_context[id].val+'"]').addClass('t-tag-selected');
                $('.js-tags-wrapper a').removeClass('t-tag-selected');
                $('.js-tags-wrapper a[data-value="'+current_context[id].val+'"]').addClass('t-tag-selected');
            }
            $('.js-show-all').click(function () {
                $('.js-tags-wrapper a').removeClass('t-tag-selected');
            });
            $element.find('.js-title').text(title);


            // prepare instance itself
            var that = this;
            that.$element = $element;
            that.id = id;
            that.hash = hash;
            that.notations = {
                'param': true,
                'hash': !!hash.length
            };

            $element.data('pageFilter', that);
        };

        // converter from input hash to param structure { id => <id>, op => '<op>', val => 'val' }
        TasksTagCloudFilterSelector.prototype.convert = function (context_hash) {

            var that = this,
                hash = that.hash;

            // not hash notification supported
            if (!hash.length) {
                return null;
            }

            // bad input
            if (!$.isArray(context_hash) || !context_hash.length) {
                return null;
            }

            // hash types aren't match
            if (context_hash[0] !== hash) {
                return null;
            }

            // hash value is 'empty', works only with correct 2-part hashes
            // Examples: 'status/0', 'project/1', 'milestone/NULL' ('NULL' - is string literal here)
            if (!context_hash[1] && context_hash[1] !== 0) {
                return null;
            }

            return {
                id: that.id,
                value: context_hash[1]
            };
        };

        TasksTagCloudFilterSelector.prototype.getTitlePartForHeader = function () {
            var that = this,
                $title = that.$element.find('.js-title'),
                title = $title.text(),
                default_title = $title.data('defaultTitle');

            if (default_title !== title) {
                $title.text('#' + title);
            }

            return default_title !== title ? '#' + title : '';
        };

        return TasksTagCloudFilterSelector;

    })(jQuery);

    // </FILTERS CLASSES DECLARATIONS>

})(jQuery);
