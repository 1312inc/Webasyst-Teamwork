var TasksTaskField = (function ($) {
    'use strict';

    TasksTaskField = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$list = that.$wrapper.find('.t-fields-list');
        that.$button = that.$wrapper.find('.t-save-button');
        that.$form = that.$wrapper.find('.t-save-settings-form');
        that.$add_link = that.$wrapper.find('.t-add-new-field-link');

        // Vars

        // Dynamic Vars

        // INIT
        that.init();
    };

    TasksTaskField.prototype.init = function () {
        var that = this;

        that.initSortable();
        that.initDeleteLinks();
        that.initAddNewField();
        that.initAddOption();
        that.initDeleteOption();
        that.initChangeForm();
        that.initSelectElement();
        that.initSubmit();
    };

    TasksTaskField.prototype.initChangeForm = function () {
        $('form.t-save-settings-form').on('change', function () {
            $('.t-save-settings-wrapper .t-save-button').removeClass('green').addClass('yellow');
        });
    };

    TasksTaskField.prototype.initSelectElement = function () {
        var that = this;
        that.$list.on('change', 'select', function (e) {
            e.preventDefault();
            var select_value = $(this).val();
            var $item_block = $(this).closest('.t-fields-list-item');

            if (['select', 'radio'].indexOf(select_value) < 0) {
                $item_block.find('.js-add-option').hide();
                $item_block.find('.js-option-values').hide();
                $item_block.find('.js-option-values input').prop('disabled', true);
            } else {
                $item_block.find('.js-add-option').show();
                $item_block.find('.js-option-values').show();
                $item_block.find('.js-option-values input').prop('disabled', false);
            }
        });
    };

    TasksTaskField.prototype.initAddNewField = function () {
        var that = this;
        var $add_link = that.$add_link;
        var $list = that.$list;
        var id_counter = -1;

        $add_link.click(function (e) {
            e.preventDefault();
            var $item = $list.find('.t-fields-list-item.is-template').clone();
            var $inputs = $item.find('[name]');

            $inputs.each(function (index) {
                $(this).attr('name', $(this).attr('name').replace('_template_', id_counter));
            });
            
            $item.data('id', id_counter).attr('data-id', id_counter);
            $item.removeClass('is-template');
            $item.appendTo($list);

            id_counter--;
            
            // Trigger initSelectElement method to hide options
            $item.find('select').trigger('change');
        });
    };

    TasksTaskField.prototype.initAddOption = function () {
        var that = this;
        that.$list.on('click', '.js-add-option', function (e) {
            e.preventDefault();

            var $item_block = $(this).closest('.t-fields-list-item');
            var field_id = $item_block.data('id');
            let clone_dom = that.$list.find('.is-template .js-option-values').html();
            $(this).closest('.t-fields-list-item').find('.js-option-values').append(clone_dom.replace(/_template_/, field_id));
            $('form.t-save-settings-form').trigger('change');
        });
    }

    TasksTaskField.prototype.initDeleteOption = function () {
        var that = this;
        that.$list.on('click', '.js-delete-option', function (e) {
            e.preventDefault();
            $(this).closest('.js-option-block').remove();
            $('form.t-save-settings-form').trigger('change');
        });
    }

    TasksTaskField.prototype.initDeleteLinks = function () {
        var that = this;
        var $list = that.$list;

        var deleteField = function ($item) {
            var id = $.trim($item.data('id'));

            if (id.substr(0, 10) === '_template_') {
                $item.remove();
                return;
            }

            if (confirm('Delete?')) {
                $item.hide();
                $.post('?module=fields&action=delete', {id: id})
                    .done(function () {
                        $item.remove();
                    })
                    .error(function () {
                        $item.show();
                    });
            }
        };

        $list.on('click', '.t-delete-field-link', function (e) {
            e.preventDefault();
            var $item = $(this).closest('.t-fields-list-item');
            deleteField($item);
        });
    };

    TasksTaskField.prototype.initSubmit = function () {
        var that = this;
        var $form = that.$form;
        var $loading = $form.find('.t-loading');

        $form.submit(function (e) {
            e.preventDefault();

            $loading.show();

            $.post('?module=fields&action=save', $form.serialize())
                .done(function () {
                    $.tasks.redispatch();
                })
                .always(function () {
                    $loading.hide();
                });
        });
    };

    TasksTaskField.prototype.initSortable = function () {
        var that = this;
        var $list = that.$list;

        $list.sortable({
            axis: 'y',
            items: '.t-fields-list-item:not(.clone)',
            distance: 5,
            containment: 'parent',
            tolerance: 'pointer',
            handle: '.t-sort-handler',
        });
    };

    return TasksTaskField;

})(jQuery);
