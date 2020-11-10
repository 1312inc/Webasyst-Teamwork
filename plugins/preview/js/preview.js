
var TasksPreviewPlugin = ( function($) { "use strict";

    TasksPreviewPlugin = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$preview_link = that.$wrapper.find('.t-plugin-preview-link');
        that.$task = that.$wrapper.closest('#t-edit-task-form');
        that.$task_wrapper = that.$task.closest('.t-task-page-wrapper');
        that.$preview = that.$wrapper.find('.t-plugin-preview-wrapper');

        // CONST
        that.task_id = options.task_id;
        that.info_url = "?plugin=preview&module=task&action=info&id=" + that.task_id;

        // VARS
        that.context = {
            preview: false,
            loading: false
        };


        // INIT
        that.init();
    };

    TasksPreviewPlugin.prototype.init = function () {
        var that = this;
        that.initPreviewLink();
        that.initBackLink();
    };

    TasksPreviewPlugin.prototype.initPreviewLink = function () {
        var that = this;

        that.$preview_link.click(function (e) {
            e.preventDefault();
            if (!that.context.preview && !that.context.loading) {
                that.loadPreview();
            }
        });
    };

    TasksPreviewPlugin.prototype.initBackLink = function () {
        var that = this,
            $task_wrapper = that.$task_wrapper;
        $task_wrapper.on('click', '.t-plugin-preview-back-link', function (e) {
            e.preventDefault();
            if (that.context.preview) {
                that.removePreview();
                that.context.preview = false;
            }
        });
    };

    TasksPreviewPlugin.prototype.loadPreview = function () {
        var that = this,
            $task = that.$task,
            $task_wrapper = that.$task_wrapper,
            $preview = that.$preview,
            $preview_link = that.$preview_link;

        that.context.loading = true;
        $preview_link.addClass('t-is-loading');

        var data = that.getFormData();
        $.post(that.info_url, data, function (html) {
            $preview.html(that.renderTaskInfoBlock(html));
            $task_wrapper.append($preview.show());
            $task.hide();
            that.context.preview = true;
            that.context.loading = false;
            $preview_link.removeClass('t-is-loading');
        });

    };

    TasksPreviewPlugin.prototype.renderTaskInfoBlock = function (html) {
        var $div = $('<div></div>').html(html);
        $div.find('.t-tag-cloud-widget').remove();
        $div.find('.t-controls-wrapper').remove();
        $div.find('.t-task-buttons').remove();
        return $div;
    };

    TasksPreviewPlugin.prototype.removePreview = function () {
        var that = this,
            $task = that.$task,
            $preview = that.$preview;
        $preview.html('').hide();
        $task.show();
    };

    TasksPreviewPlugin.prototype.getFormData = function () {
        return this.$task.serializeArray();
    };

    return TasksPreviewPlugin;

})(jQuery);
