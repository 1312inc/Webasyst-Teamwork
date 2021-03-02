var TasksSettingsSidebar = (function ($) { "use strict";

    TasksSettingsSidebar = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];
        that.$wrapper.data('sidebar', this);

        // VARS
        that.storage = $.storage;

        // DYNAMIC VARS

        // INIT
        that.init();
    };

    TasksSettingsSidebar.prototype.init = function () {
        var that = this;
        that.initArchivedToggles();
    };

    TasksSettingsSidebar.prototype.initArchivedToggles = function () {
        var that = this,
            $wrapper = that.$wrapper,
            storage = that.storage,
            $toggles = $wrapper.find('.js-archived-item-list-toggle');

        var buildKey = function (type) {
            return 'tasks/settings/toggle/' + type + '/';
        };
        var isShown = function (type) {
            return storage.get(buildKey(type));
        };
        var setShown = function (type) {
            return storage.set(buildKey(type), '1');
        };
        var setHidden = function (type) {
            return storage.del(buildKey(type));
        };
        var findItem = function (type) {
            return $wrapper.find('.js-archived-item-list[data-list-type="' + type + '"]');
        };
        var showItem = function (type) {
            findItem(type).show();
        };
        var hideItem = function (type) {
            findItem(type).hide();
        };
        var setShownText = function ($link) {
            $link.text($link.data('textShown'));
        };
        var setHiddenText = function ($link) {
            $link.text($link.data('textHidden'));
        };
        var hide = function ($link) {
            var type = $link.data('listType');
            hideItem(type);
            setHidden(type);
            setHiddenText($link);
        };
        var show = function ($link) {
            var type = $link.data('listType');
            showItem(type);
            setShown(type);
            setShownText($link);
        };

        var handler = function ($link, toggle) {
            var type = $link.data('listType'),
                is_shown = isShown(type);
            if (toggle) {
                is_shown ? hide($link) : show($link);
            } else {
                is_shown ? show($link) : hide($link);
            }
        };

        $toggles.each(function () {
            handler($(this));
        });

        $toggles.click(function () {
            handler($(this), true);
        });
    };

    TasksSettingsSidebar.prototype.selectItem = function (type, id) {
        type = type || '';
        id = id || '';
        var that = this,
            $wrapper = that.$wrapper,
            $item = null;
        $wrapper.find('li.selected').removeClass('selected');
        if (id) {
            $item = $wrapper.find('li[data-item-type="' + type + '"][data-id="' + id + '"]');
        } else {
            $item = $wrapper.find('li[data-item-type="' + type + '"]');
        }
        $item.addClass('selected');
    };

    return TasksSettingsSidebar;

})(jQuery);
