var TasksWidgetActorsFilterControl = (function ($) { "use strict";

    TasksWidgetActorsFilterControl = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];

        // VARS
        that.namespace = options.namespace || '';

        // INIT
        that.init();
    };

    TasksWidgetActorsFilterControl.prototype.init = function () {
        var that = this;
        that.initControlBlock('projects');
        that.initControlBlock('scopes');
    };

    TasksWidgetActorsFilterControl.prototype.buildInputName = function (name) {
        var that = this,
            ns = $.trim(that.namespace);
        return ns.length ? ns + '[' + name + ']' : name;
    };

    TasksWidgetActorsFilterControl.prototype.getInput = function (name, value) {
        var that = this,
            $wrapper = that.$wrapper,
            input_name = that.buildInputName(name),
            $inputs = $wrapper.find('[name="' + input_name + '"]');
        if (value !== undefined) {
            return $inputs.filter('[value="' + value + '"]');
        }
        return $inputs;
    };

    TasksWidgetActorsFilterControl.prototype.getControlBlock = function (type) {
        var that = this,
            $wrapper = that.$wrapper;
        return $wrapper.find('.t-control-block[data-type="' + type + '"]');
    };

    TasksWidgetActorsFilterControl.prototype.showControlsBlock = function ($block) {
        $block.show().find(':input').attr('disabled', false);
    };

    TasksWidgetActorsFilterControl.prototype.hideControlsBlock = function ($block) {
        $block.hide().find(':input').attr('disabled', true);
    };

    TasksWidgetActorsFilterControl.prototype.initControlBlock = function (type) {
        var that = this,
            $block = that.getControlBlock(type),
            $radio = that.getInput('type', type);

        var updateState = function () {
            if ($radio.is(':checked')) {
                that.showControlsBlock($block);
            } else {
                that.hideControlsBlock($block);
            }
        };

        that.getInput('type').change(updateState);
        updateState();
    };

    return TasksWidgetActorsFilterControl;

})(jQuery);
