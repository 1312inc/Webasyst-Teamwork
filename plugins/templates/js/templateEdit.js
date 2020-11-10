var TasksTemplatesPluginTemplateEdit = ( function($) { "use strict";


    TasksTemplatesPluginTemplateEdit = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$icons_block = that.$wrapper.find('.t-icons-block');
        that.$icon_input = that.$wrapper.find('.t-icon-input');
        that.$form = that.$wrapper.find('form');
        that.$button = that.$form.find(':submit');

        // Vars
        that.template = options.template || {};

        // Dynamic Vars

        // INIT
        that.init();
    };

    TasksTemplatesPluginTemplateEdit.prototype.init = function () {
        this.initIcons();
        this.initSubmit();
        if (this.template.id > 0) {
            this.initDeleteLink();
        }
    };

    TasksTemplatesPluginTemplateEdit.prototype.initIcons = function () {
        var that = this;

        that.$icons_block.on('click', 'li a', function (e) {
            e.preventDefault();
            var $el = $(this),
                $li = $el.closest('li'),
                val = $li.data('icon');
            that.$icons_block.find('li.selected').removeClass('selected');
            that.$icon_input.val(val);
            $li.addClass('selected');
            that.clearValidateErrors();
        });

    };

    TasksTemplatesPluginTemplateEdit.prototype.showValidateErrors = function (errors) {
        var that = this,
            $form = that.$form;
        $.each(errors || {}, function (name, msg) {
            var $input = $form.find(':input[name="data[' + name + ']"]').addClass('error');
            $input.after('<em class="errormsg">' + msg + '</em>');
        });
    };

    TasksTemplatesPluginTemplateEdit.prototype.clearValidateErrors = function () {
        var that = this,
            $form = that.$form;
        $form.find('.error').removeClass('error');
        $form.find('.errormsg').remove();
    };

    TasksTemplatesPluginTemplateEdit.prototype.initSubmit = function () {
        var that = this;
        that.$form.submit(function (e) {
            e.preventDefault();
            that.onSubmit();
        })
    };

    TasksTemplatesPluginTemplateEdit.prototype.onSubmit = function () {
        var that = this,
            $form = that.$form,
            $icon = $form.find('.t-loading'),
            $button = that.$button;

        that.clearValidateErrors();
        $button.attr('disabled', true);
        $icon.show();

        $.post($form.attr('action'), $form.serialize(), 'json')
            .done(function (r) {
                if (r.status !== 'ok') {
                    that.showValidateErrors(r.errors || {});
                    return;
                }
                if (r && r.data && r.data.template && r.data.template.id) {
                    TasksTemplatesPlugin.updateMenuItem(r.data.template.id, r.data.template);
                    $.wa.setHash('#/templates/edit/' + r.data.template.id + '/')
                }
            })
            .always(function () {
                $icon.hide();
                $button.attr('disabled', false);
            });
    };

    TasksTemplatesPluginTemplateEdit.prototype.initDeleteLink = function () {
        var that = this,
            $wrapper = that.$wrapper,
            $link = $wrapper.find('.js-delete');
        $link.click(function (e) {
            e.preventDefault();
            if (confirm('Вы уверены, что хотите удалить?')) {
                $link.find('.icon16').removeClass('delete').addClass('loading');
                $.post('?plugin=templates&module=template&action=delete', { id: that.template.id }, 'json')
                    .done(function (r) {
                        if (r && r.status === 'ok') {
                            if (r.data && r.data.deleted) {
                                TasksTemplatesPlugin.updateMenuItem(that.template.id, null);
                            }
                            $.wa.setHash('#/templates/add/');
                        }
                    })
                    .always(function () {
                        $link.find('.icon16').removeClass('loading').addClass('delete');
                    });
            }
        });
    };

    return TasksTemplatesPluginTemplateEdit;

})(jQuery);
