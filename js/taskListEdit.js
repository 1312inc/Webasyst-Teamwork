var TaskListEdit = (function ($) {

    TaskListEdit = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];
        that.$form = that.$wrapper.find('form');
        that.$button = that.$form.find(':submit');
        that.$icons_block = that.$wrapper.find('.t-icons-block');
        that.$icon_input = that.$wrapper.find('.t-icon-input');

        // VARS
        that.callbacks = $.isPlainObject(options['callbacks']) ? options['callbacks'] : {};


        // DYNAMIC VARS

        // INIT
        that.dialog = that.$wrapper.waDialog({
            onLoad: function () {
                that.initIcons();
                that.bindEvents();
            },
            onSubmit: function (dialog, event) {
                event.preventDefault();
                that.onSubmit();
            }
        });
    };

    TaskListEdit.prototype.initIcons = function () {
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

    TaskListEdit.prototype.bindEvents = function () {
        var that = this,
            $form = that.$form,
            timer = null;

        $form.on('change', ':input', function () {
            that.clearValidateErrors();
        });

        $form.on('keyup', ':input', function () {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                that.clearValidateErrors();
            }, 200);
        });

    };

    TaskListEdit.prototype.showValidateErrors = function (errors) {
        var that = this,
            $form = that.$form;
        $.each(errors || {}, function (name, msg) {
            var $input = $form.find(':input[name="data[' + name + ']"]').addClass('error');
            $input.after('<em class="errormsg">' + msg + '</em>');
        });
    };

    TaskListEdit.prototype.clearValidateErrors = function () {
        var that = this,
            $form = that.$form;
        $form.find('.error').removeClass('error');
        $form.find('.errormsg').remove();
    };

    TaskListEdit.prototype.onSubmit = function () {
        var that = this,
            $form = that.$form,
            $icon = $form.find('.t-loading'),
            dialog = that.dialog,
            $button = that.$button,
            onDoneSubmit = that.callbacks.onDoneSubmit;

        onDoneSubmit = typeof onDoneSubmit === 'function' ? onDoneSubmit : null;

        that.clearValidateErrors();
        $button.attr('disabled', true);
        $icon.show();

        $.post($form.attr('action'), $form.serialize())
            .done(function (r) {

                if (r.status === 'ok') {
                    onDoneSubmit && onDoneSubmit(r);
                    dialog.trigger('close');
                    return;
                }

                $button.attr('disabled', false);
                that.showValidateErrors(r.errors || {});
            })
            .always(function () {
                $icon.hide();
            });
    };

    return TaskListEdit;

})(jQuery);
