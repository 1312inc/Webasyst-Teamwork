var TaskFieldEdit = (function ($) {
    'use strict';

    TaskFieldEdit = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$editor = options.$editor;
        that.$link = $('.t-buttons-block .js-more-options');
        that.$block = $('.t-task-page-block .t-fields-block');

        // CONST
        that.ns = that.$wrapper.attr('id');

        // Vars
        that.storage = $.storage;
        that.locales = options.locales || {};
        that.task = options.task || {};

        // Dynamic Vars
        that.project_id = null;

        // INIT
        that.init();
    };

    TaskFieldEdit.prototype.init = function () {
        var that = this;

        that.initMoreOptionsLink();
        that.initValidateTaskType();
    };

    TaskFieldEdit.prototype.initMoreOptionsLink = function () {
        var that = this;
        var $wrapper = that.$wrapper;
        var $block = that.$block;
        var $link = that.$link;
        var $task = $wrapper.closest('.t-task-page-wrapper');
        var storage_key = 'tasks/expanded';

        // HELPERS
        var arrUp = function () {
            $link.find('.uarr').show();
            $link.find('.darr').hide();
        };
        var arrDown = function () {
            $link.find('.uarr').hide();
            $link.find('.darr').show();
        };
        var isArrDown = function () {
            return $link.find('.uarr').is(':hidden');
        };
        var expand = function () {
            that.storage.set(storage_key, 1);
            arrUp();
            $block.show();
        };
        var collapse = function () {
            that.storage.del(storage_key, 1);
            arrDown();
            $block.hide();
        };

        // init state
        // if (that.storage.get(storage_key)) {
        //     expand();
        // } else {
        //     collapse();
        // }

        // click expand/collapse handler
        $link.on('click', function (e) {
            e.preventDefault();
            if (isArrDown()) {
                expand();
            } else {
                collapse();
            }
        });

        // show fields depending on task type
        $task.find('.js-task-type-hidden').on('change', function () {
            var type_value = $(this).val();
            $wrapper.find("[data-task-type]").hide();
            $wrapper.find("[data-task-type] :input").prop('disabled', true);
            $wrapper.find("[data-task-type='"+type_value+"']").show();
            $wrapper.find("[data-task-type='"+type_value+"'] :input").prop('disabled', false);
        });
        if (that.task.id) {
            $task.find('.js-task-type-hidden').trigger('change');
        }
    };

    TaskFieldEdit.prototype.initValidateTaskType = function () {
        var that = this;
        var $wrapper = that.$wrapper;
        var $task = $wrapper.closest('.t-task-page-wrapper');
        var $form = $task.find('#t-edit-task-form');

        $form.on('task_before_submit', function (event) {
            event.preventDefault();
            $form.removeData('validate');
            var task_type = $task.find('.js-task-type-hidden').val();

            if (!task_type) {
                // $task.find('.js-errors-block').html('<span style="color: red;">'+ that.locales.select_task_type +'</span>');
                // $form.data('validate', false);
            }

            setTimeout( function() {
                $task.find(".js-errors-block").html('');
            }, 3000);
        });
    };

    return TaskFieldEdit;

})(jQuery);
