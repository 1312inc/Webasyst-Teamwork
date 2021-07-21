var TasksDropDownMenu = (function($) {

    var clzs = {
        item: 'js-dropdown-menu-item',
        selected: 'js-dropdown-menu-item-selected',
        disabled: 'js-dropdown-menu-item-disabled',
        title: 'js-dropdown-menu-title'
    };

    var findItemByValue = function ($menu, value) {
        return $menu.find('.' + clzs.item + '[data-value="' + value + '"]');
    };

    var markItemSelected = function ($menu, $item) {
        $menu.find('.' + clzs.selected).removeClass(clzs.selected);
        $item.addClass(clzs.selected);
    };

    var setItemDisabled = function ($item) {
        $item.hide().addClass(clzs.disabled);
    };

    var setItemEnable = function ($item) {
        $item.show().removeClass(clzs.disabled);
    };

    var isItemDisabled = function ($item) {
        return $item.hasClass(clzs.disabled);
    };

    var isItemEnabled = function ($item) {
        return !$item.hasClass(clzs.disabled);
    };

    var findFirstEnabledItem = function ($menu) {
        return $menu.find('.' + clzs.selected + ':not(.' + clzs.disabled +')');
    };

    var findSelected = function ($menu) {
        return $menu.find('.' + clzs.selected);
    };

    var getFirstItem = function ($menu) {
        return $menu.find('.' + clzs.item + ':eq(0)');
    };

    var setTitleByItem = function ($menu, $item) {
        var title = getItemTitle($item),
            color = getItemColor($item),
            $title = $menu.find('.' + clzs.title);
        $title.html(title);
        if (color !== null) {
            $title.css('color', color);
        } else {
            $title.css('color', '');
        }
    };

    var updateHiddenInputByItem = function ($input, $item) {
        $input.val(getItemValue($item));
    };

    var getItemInfo = function ($item, key) {
        var data = $item.data() || {};
        data.title = getItemTitle($item);
        data.name = getItemName($item);
        data.link = getItemLink($item);
        data.color = getItemColor($item);
        if (key !== undefined) {
            return data[key];
        }
        return data;
    };

    var getItemTitle = function ($item) {
        var $link = $item.find('>a:first');

        if ($item.data('title')) {
            return $.trim($item.data('title'));
        }else {
            if ($link.length) {
                return $.trim($link.html());
            } else {
                return $.trim($item.text());
            }
        }
    };

    var getItemColor = function ($item) {
        var color = $item.data('color');
        if (typeof color !== 'string') {
            return null;
        }
        if (color.length > 0 && color.substr(0, 1) !== '#') {
            return '#' + color;
        } else {
            return color;
        }
    };

    var getItemName = function ($item) {
        return $.trim($item.text());
    };

    var getItemValue = function ($item) {
        return $item.data('value') || '';
    };

    var getItemLink = function ($item) {
        var $link = $item.find('>a:first');
        if ($link.length) {
            return $link.attr('href');
        } else {
            return '';
        }
    };

    var setItemTitle = function($item, title) {
        var $link = $item.find('>a:first');
        title = $.trim(title);
        if ($link.length) {
            $link.html(title);
        } else {
            $item.text(title);
        }
    };

    var setItemName = function ($item, name) {
        var $link = $item.find('>a:first');
        name = $.wa.encodeHTML($.trim(name));
        if ($link.length) {
            $link.text(name);
        } else {
            $item.text(name);
        }
    };

    var setItemLink = function ($item, link) {
        var $link = $item.find('>a:first');
        link = $.trim(link);
        if ($link.length) {
            $link.attr('href', link);
        }
    };

    TasksDropDownMenu = function($menu, settings) {
        var that = this;
        that.$menu = $menu;
        that.settings = settings || {};
        that.$hidden = that.settings.$hidden || $();

        that.$selected = findSelected(that.$menu);
        if (!that.$selected.length) {
            that.$selected = getFirstItem(that.$menu);
        }
        markItemSelected(that.$menu, that.$selected);
        setTitleByItem(that.$menu, that.$selected);
        if (that.$hidden.length) {
            updateHiddenInputByItem(that.$hidden, that.$selected);
        }

        that.onSelect(function (id) {
            that.setSelected(id);
            // hide effect
            var $menuV = that.$menu.find('.menu-v');
            $menuV.hide();
            setTimeout( function() {
                $menuV.removeAttr("style");
            }, 100);

        });

        // init colors
        that.eachItem(function ($el, id, info) {
            if (info.color !== null) {
                $el.find('a').css('color', info.color);
            }
        });

        that.$menu.data('dropDownMenu', that);
    };

    TasksDropDownMenu.prototype.disableItem = function (value) {
        var that = this,
            $menu = that.$menu,
            $item = findItemByValue($menu, value),
            $selected = findSelected($menu);

        setItemDisabled($item);
        if (isItemDisabled($selected)) {
            var $first = findFirstEnabledItem($menu),
                first_val = getItemValue($first);
            that.setSelected(first_val);
        }
    };

    TasksDropDownMenu.prototype.enableItem = function (value) {
        var that = this,
            $menu = that.$menu,
            $item = findItemByValue($menu, value);
        setItemEnable($item);
    };

    TasksDropDownMenu.prototype.getItems = function () {
        return this.$menu.find('.' + clzs.item);
    };

    TasksDropDownMenu.prototype.getOptions = function () {
        return this.getItems().map(function () {
            return getItemInfo($(this));
        }).toArray();
    };

    TasksDropDownMenu.prototype.eachItem = function (walker) {
        this.getItems().each(function () {
            var $item = $(this),
                info = getItemInfo($item);
            walker($(this), info.value, info);
        });
    };

    TasksDropDownMenu.prototype.eachOption = function (walker) {
        $.each(this.getOptions(), function (index, option) {
            return walker(option.value, option);
        })
    };

    TasksDropDownMenu.prototype.getOption = function (value, key) {
        var $item = findItemByValue(this.$menu, value);
        return getItemInfo($item, key);
    };

    TasksDropDownMenu.prototype.updateOption = function (value, data) {
        var $item = findItemByValue(this.$menu, value);
        if (!$item.length) {
            return;
        }
        if (typeof data === 'string') {
            var param_name = data,
                param_value = arguments[2];
            data = {};
            data[param_name] = param_value;
        }
        $.each(data, function (param_name, param_value) {
            if (param_name === 'title') {
                setItemTitle($item, param_value);
            } else if (param_name === 'name') {
                setItemName($item, param_value);
            } else if (param_name === 'link') {
                setItemLink($item, param_value);
            } else if (param_name !== 'value') {
                $item.data(param_name, param_value);
            }
        });
    };

    TasksDropDownMenu.prototype.updateOptions = function (items) {
        var that = this;
        $.each(items, function (value, item) {
            that.updateOption(value, item);
        });
    };

    TasksDropDownMenu.prototype.isEnabled = function (value) {
        return !isItemDisabled(findItemByValue(this.$menu, value));
    };

    TasksDropDownMenu.prototype.isDisabled = function (value) {
        return isItemDisabled(findItemByValue(this.$menu, value));
    };

    TasksDropDownMenu.prototype.setSelected = function (value) {
        var that = this
        var $item = findItemByValue(that.$menu, value);
        if ($item.length) {
            that.$selected = $item;
            markItemSelected(that.$menu, that.$selected);
            setTitleByItem(that.$menu, that.$selected);
            if (that.$hidden.length) {
                updateHiddenInputByItem(that.$hidden, that.$selected);
            }
        }
    };

    TasksDropDownMenu.prototype.getSelected = function (key) {
        return getItemInfo(this.$selected, key);
    };

    TasksDropDownMenu.prototype.getInfo = function (key) {
        var data = this.$menu.data() || {};
        if (key !== undefined) {
            return data[key];
        }
        return data;
    };

    TasksDropDownMenu.prototype.onSelect = function (handler) {
        if (typeof handler !== 'function') {
            return;
        }
        this.$menu.on('click', '.' + clzs.item + ' a', function () {
            var $item = $(this).closest('.' + clzs.item),
                args = [];
            args.push(getItemValue($item), getItemInfo($item));
            args.concat(Array.prototype.slice.apply(arguments));
            handler.apply($item.get(0), args);
        });
    };

    return TasksDropDownMenu;

})(jQuery);
