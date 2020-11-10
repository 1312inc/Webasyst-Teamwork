var TasksTemplatesPluginTaskEdit = (function ($) {
    "use strict";

    TasksTemplatesPluginTaskEdit = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;

        // Vars
        that.template = options.template || {};
        that.$form = $('#t-edit-task-form');
        that.open_content_lenght = that.$form.find('textarea[name="data[text]"]').val().length;

        // INIT
        that.init();
    };

    TasksTemplatesPluginTaskEdit.prototype.init = function () {
        var that = this;
        that.updateTaskBody();
    };

    TasksTemplatesPluginTaskEdit.prototype.updateTaskBody = function () {
        var that = this,
            $links = that.$wrapper.find('.js-template-header-link');

        $links.on('click', function (e) {
            e.preventDefault();
            var template_id = $(this).data('template');
            if (template_id) {
                that.getTemplate(template_id);
            }

        })
    };

    TasksTemplatesPluginTaskEdit.prototype.getTemplate = function (template_id) {
        var that = this;

        $.post('?plugin=templates&module=template&action=info', {id: template_id})
            .done(function (r) {
                if (!r || !r.data || !r.data.template || !r.data.template.id) {
                    return;
                }
                that.applyTemplateOnForm(r.data.template);
            })
    };


    TasksTemplatesPluginTaskEdit.prototype.applyTemplateOnForm = function (template) {
        var that = this,
            $task_name = that.$form.find('input[name="data[name]"]'),
            task_name_val = $task_name.val(),
            $task_content = that.$form.find('textarea[name="data[text]"]'),
            task_content_val = $task_content.val();

        if (typeof template.name === 'string' && template.name.length > 0 && (!that.open_content_lenght || !task_name_val)) {
            $task_name.attr('placeholder', $.wa.encodeHTML(template.name || ''));
        }

        if (typeof template.text === 'string' && template.text.length > 0) {
            if (task_content_val.length > 0 && that.open_content_lenght > 0) {
                var delimiter = '\n------------------------------ \n';
                $task_content.val(task_content_val.split(delimiter)[0] + delimiter + template.text);
            } else {
                $task_content.val(template.text);
            }
        }

    };

    return TasksTemplatesPluginTaskEdit;

})(jQuery);
