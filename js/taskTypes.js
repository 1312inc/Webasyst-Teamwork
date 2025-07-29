var TasksTaskTypes = (function ($) {
    "use strict";

    TasksTaskTypes = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$list = that.$wrapper.find('.t-types-list');
        that.$button = that.$wrapper.find('.t-save-button');
        that.$form = that.$wrapper.find('.t-save-settings-form');
        that.$add_link = that.$wrapper.find('.t-add-new-type-link');

        // Vars


        // Dynamic Vars

        // INIT
        that.init();
    };

    TasksTaskTypes.prototype.init = function () {
        var that = this;

        // select sidebar item
        $('#t-settings-sidebar-wrapper').data('sidebar').selectItem('task_types');

        that.initSortable();
        that.changeInputsListener();
        that.initDeleteLinks();
        that.initColorPickers();

        var editor = that.initEditLinks();
        that.initAddNewTypeLink(editor);

        that.initSubmit();

    };

    TasksTaskTypes.prototype.highlightButton = function () {
        this.$button.removeClass('green').addClass('yellow');
    };

    TasksTaskTypes.prototype.initColorPickers = function () {
        var that = this;
        var $list = that.$list;
        // HERE INIT COLOR PICKER
    };

    TasksTaskTypes.prototype.initAddNewTypeLink = function (editor) {
        var that = this,
            $add_link = that.$add_link,
            $list = that.$list,
            id_counter = 1;

        $add_link.click(function (e) {
            e.preventDefault();
            var $item = $list.find('.t-types-list-item.is-template').clone();
            var $input_name = $item.find('.t-type-name-input');
            var $input_color = $item.find('.t-type-color-input');
            var id = '_template_' + id_counter;

            id_counter++;
            $input_name.attr('name', $input_name.attr('name').replace('_template_', id));
            $input_color.attr('name', $input_color.attr('name').replace('_template_', id));

            $item.data('id', id).attr('data-id', id);
            $item.removeClass('is-template');
            $item.appendTo($list);

            editor.makeEditable($item);
        });
    };

    TasksTaskTypes.prototype.initDeleteLinks = function () {
        var that = this,
            $list = that.$list;

        var deleteType = function ($item) {
            var id = $.trim($item.data('id'));

            if (id.substr(0, 10) === '_template_') {
                $item.remove();
                return;
            }

            if (confirm('Delete?')) {
                $item.hide();
                $.post('?module=types&action=delete', { id: id })
                    .done(function () {
                        $item.remove();
                    })
                    .error(function () {
                        $item.show();
                    });
            }

        };

        $list.on('click', '.t-delete-type-link', function (e) {
            e.preventDefault();
            var $item = $(this).closest('.t-types-list-item');
            deleteType($item);
        });
    };

    TasksTaskTypes.prototype.changeInputsListener = function () {
        var that = this,
            $form = that.$form,
            onChangeInput = function () {
                that.highlightButton();
            },
            contexts = {
                // '<input_name>': { timer: <timer>, val: <string> }
            };

        $form.on('change', ':text', onChangeInput);

        // init contexts
        $form.find(':text', function () {
            var $input = $(this),
                name = $input.attr('name');
            contexts[name] = contexts[name] || { val: $input.val() };
        });

        // on typing change listener
        $form.on('keydown', ':text', function () {
            var $input = $(this),
                name = $input.attr('name'),
                context = contexts[name] || {},
                args = arguments;
            context.timer && clearTimeout(context.timer);
            context.timer = setTimeout(function () {
                context.timer = null;
                var current_val = $.trim($input.val()),
                    prev_val = $.trim(context.val);
                if (current_val !== prev_val) {
                    onChangeInput.apply($input.get(0), args);
                }
                context.val = current_val;
            }, 400);
        });

    };

    TasksTaskTypes.prototype.initEditLinks = function () {
        var that = this,
            $list = that.$list,
            $form = $('.t-save-settings-form'),
            contexts = {
                // <id>: {  }
            };

        var makeEditable = function ($item) {
            var $text = $item.find('.t-type-name-text'),
                $input = $item.find('.t-type-name-input'),
                $color = $item.find('.t-type-color-wrapper');

            $input.show();
            $color.show();
            $text.hide();
            $input.focus().select();
            return {
                $text: $text,
                $input: $input,
                $color: $color,
                val: $input.val()
            };
        };

        // Color picker
        $list.on('click', '.js-colorpicker, .t-type-color-wrapper .color', function() {
            var $field = $(this).closest('.t-type-color-wrapper');
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
                if (event.keyCode == "27") {
                    detachFromThis();
                }
            });

            // Do not bubble click events so that colorpicker does not close when user clicks inside it
            $colorpicker_wrapper.click(function() { return false; });

            // Update color when user modifies value in input
            $input.onWhile(function() {
                return attached_to_this;
            }, 'keyup', function() {
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
                farbtastic.linkTo(function() { });
                $colorpicker_wrapper.slideUp();
                attached_to_this = false;
            }

        });

        $list.on('click', '.t-edit-type-link', function (e) {
            e.preventDefault();
            var $link = $(this),
                $item = $link.closest('.t-types-list-item'),
                id = $item.data('id');
            if (contexts[id]) {
                var $text = $item.find('.t-type-name-text');
                var $input = $item.find('.t-type-name-input');
                var $color = $item.find('.t-type-color-wrapper');

                //hide edit
                $input.hide();
                $color.hide();
                $text.show();
                $link.find('.t-edit').removeClass('edit-bw').addClass('edit');

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

    TasksTaskTypes.prototype.initSubmit = function () {
        var that = this,
            $form = that.$form,
            $loading = $form.find('.t-loading');

        $form.submit(function (e) {
            e.preventDefault();

            $loading.show();

            $.post('?module=types&action=save', $form.serialize())
                .done(function () {
                    $.tasks.redispatch();
                })
                .always(function () {
                    $loading.hide();
                });
        });
    };

    TasksTaskTypes.prototype.initSortable = function () {
        var that = this,
            $list = that.$list;

        $list.sortable({
            axis: 'y',
            items: '.t-types-list-item:not(.clone)',
            distance: 5,
            containment: 'parent',
            tolerance: 'pointer',
            handle: '.t-sort-handler',
            update: function (e, ui) {
                that.highlightButton();
            }
        });
    };

    return TasksTaskTypes;

})(jQuery);
