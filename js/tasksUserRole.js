var TasksUserRole = (function ($) {
    "use strict";

    TasksUserRole = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$list = that.$wrapper.find('.t-roles-list');
        that.$button = that.$wrapper.find('.t-save-button');
        that.$form = that.$wrapper.find('.t-save-settings-form');
        that.$add_link = that.$wrapper.find('.t-add-new-role-link');

        // Vars


        // Dynamic Vars

        // INIT
        that.init();
    };

    TasksUserRole.prototype.init = function () {
        var that = this;

        // select sidebar item
        $('#t-settings-sidebar-wrapper').data('sidebar').selectItem('user_roles');

        that.initSortable();
        that.changeInputsListener();
        that.initDeleteLinks();
        that.initColorPickers();

        var editor = that.initEditLinks();
        that.initAddNewRoleLink(editor);

        that.initSubmit();

    };

    TasksUserRole.prototype.highlightButton = function () {
        this.$button.removeClass('green').addClass('yellow');
    };

    TasksUserRole.prototype.initColorPickers = function () {
        var that = this;
        var $list = that.$list;
        // HERE INIT COLOR PICKER
    };

    TasksUserRole.prototype.initAddNewRoleLink = function (editor) {
        var that = this;
        var $add_link = that.$add_link;
        var $list = that.$list;
        var id_counter = 1;

        $add_link.click(function (e) {
            e.preventDefault();
            var $item = $list.find('.t-settings-item.is-template').clone();
            var id = '_template_'+ id_counter;
            var names = [
                'name',
                'show_inbox',
                'send_notifications',
                'color'
            ];

            id_counter++;
            for (let _name of names) {
                let $input_name = $item.find('.t-role-'+ _name +'-input');
                if($input_name.length) {
                    $input_name.attr('name', $input_name.attr('name')?.replace('_template_', id));
                }
            }

            $item.data('id', id).attr('data-id', id);
            $item.removeClass('is-template');
            $item.attr('style', '');
            $item.appendTo($list);

            editor.makeEditable($item);
        });
    };

    TasksUserRole.prototype.initDeleteLinks = function () {
        var that = this;
        var $list = that.$list;

        var deleteRole = function ($item) {
            var id = $.trim($item.data('id'));

            if (id.substr(0, 10) === '_template_') {
                $item.remove();
                return;
            }

            if (confirm('Delete?')) {
                $item.hide();
                $.post('?module=roles&action=delete', { id: id })
                    .done(function () {
                        $item.remove();
                    })
                    .error(function () {
                        $item.show();
                    });
            }

        };

        $list.on('click', '.t-delete-role-link', function (e) {
            e.preventDefault();
            var $item = $(this).closest('.t-settings-item');
            deleteRole($item);
        });
    };

    TasksUserRole.prototype.changeInputsListener = function () {
        var that = this;
        var $form = that.$form;
        var onChangeInput = function () {
                that.highlightButton();
            };
        var contexts = {
                // '<input_name>': { timer: <timer>, val: <string> }
            };

        $form.on('change', ':text', onChangeInput);

        // init contexts
        $form.find(':text', function () {
            var $input = $(this);
            var name = $input.attr('name');
            contexts[name] = contexts[name] || { val: $input.val() };
        });

        // on typing change listener
        $form.on('keydown', ':text', function () {
            var $input = $(this);
            var name = $input.attr('name');
            var context = contexts[name] || {};
            var args = arguments;
            context.timer && clearTimeout(context.timer);
            context.timer = setTimeout(function () {
                context.timer = null;
                var current_val = $.trim($input.val());
                var prev_val = $.trim(context.val);
                if (current_val !== prev_val) {
                    onChangeInput.apply($input.get(0), args);
                }
                context.val = current_val;
            }, 400);
        });

    };

    TasksUserRole.prototype.initEditLinks = function () {
        var that = this;
        var $list = that.$list;
        var $form = $('.t-save-settings-form');
        var contexts = {
                // <id>: {  }
            };

        var makeEditable = function ($item) {
            var $text = $item.find('.t-role-name-text'),
                $input = $item.find('.t-role-name-input'),
                $color = $item.find('.t-role-color-wrapper');

            $text.closest('.t-settings-item').toggleClass('is-closed is-opened');
            $input.focus().select();
            return {
                $text: $text,
                $input: $input,
                $color: $color,
                val: $input.val()
            };
        };

        // Color picker
        $list.on('click', '.js-colorpicker, .t-role-color-wrapper .color', function() {
            var $field = $(this).closest('.t-role-color-wrapper');
            var $icon = $field.find('.color');
            var $input = $field.find('input');
            var $colorpicker_wrapper = $($.parseHTML('<div style="position:absolute;z-index:98;display:none;"></div>')).appendTo($field);
            var farbtastic = $.farbtastic($colorpicker_wrapper);

            // Attach colorpicker position to this field
            var pos = $field.position();
            $colorpicker_wrapper.css({
                top: pos.top + $field.height(),
                left: pos.left
            });

            // When user selects color, change colors in table cell
            farbtastic.linkTo(function(new_color) {
                $icon.css('background', new_color);
                $input.val(new_color && new_color[0] == '#' ? new_color.substr(1) : new_color);
                $form.change();
            });

            setColor($input.val() || '#f0f0f0');

            // Show the color picker
            $colorpicker_wrapper.slideDown();

            // Close the color picker when user clicks anywhere else
            var attached_to_this = true;
            $('.content').onWhile(function() {
                return attached_to_this;
            }, 'click', detachFromThis);

            // Close colorpicker when user clicks Esc
            $(document).onWhile(function () {
                return attached_to_this;
            }, 'keyup', function (event) {
                if (event.keyCode == '27') {
                    detachFromThis();
                }
            });

            // Do not bubble click events so that colorpicker does not close when user clicks inside it
            $colorpicker_wrapper.click(function () { return false; });

            // Update color when user modifies value in input
            $input.onWhile(function () {
                return attached_to_this;
            }, 'keyup', function () {
                setColor($input.val());
            });

            return false;

            function setColor(color) {
                if(!color || color[0] != '#') {
                    color = '#' + color;
                }
                farbtastic.setColor(color);
            }

            function detachFromThis() {
                farbtastic.linkTo(function () { });
                $colorpicker_wrapper.slideUp();
                attached_to_this = false;
            }

        });

        $list.on('click', '.t-edit-role-link', function (e) {
            e.preventDefault();
            var $link = $(this);
            var $item = $link.closest('.t-settings-item');
            var id = $item.data('id');

            if (contexts[id]) {
                //hide edit
                $link.find('.t-edit').removeClass('edit-bw').addClass('edit');
                $item.toggleClass('is-closed is-opened');
                delete contexts[id];
                return;
            } else {
                contexts[id] = makeEditable($item);
                $link.find('.t-edit').removeClass('edit').addClass('edit-bw');
            }
        });

        return {
            makeEditable: function ($item) {
                var id = $item.data('id');
                contexts[id] = makeEditable($item);
            }
        };

    };

    TasksUserRole.prototype.initSubmit = function () {
        var that = this;
        var $form = that.$form;
        var $loading = $form.find('.t-loading');

        $form.submit(function (e) {
            e.preventDefault();

            $loading.show();

            $.post('?module=roles&action=save', $form.serialize())
                .done(function () {
                    $.tasks.redispatch();
                })
                .always(function () {
                    $loading.hide();
                });
        });
    };

    TasksUserRole.prototype.initSortable = function () {
        var that = this;
        var $list = that.$list;

        $list.sortable({
            axis: 'y',
            items: '.t-settings-item:not(.clone)',
            distance: 5,
            containment: 'parent',
            tolerance: 'pointer',
            handle: '.t-sort-handler',
            update: function (e, ui) {
                that.highlightButton();
            }
        });
    };

    return TasksUserRole;

})(jQuery);
