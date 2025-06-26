
var TaskExtEdit = (function ($) { 
    "use strict";

    var toInt = function (val) {
        var int = parseInt(val, 10);
        return !isNaN(int) ? int : null;
    };

    TaskExtEdit = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$editor = options.$editor;
        that.$link = that.$wrapper.find('.js-more-options');
        that.$block = that.$wrapper.find('.t-fields-block');

        // CONST
        that.ns = that.$wrapper.attr('id');

        // Vars
        that.storage = $.storage;
        that.milestones = options.milestones || {};
        that.task = options.task || {};
        that.is_new = ( that.task.id ) ? false : true;

        // Dynamic Vars
        that.project_id = null;

        // INIT
        that.init();
    };

    TaskExtEdit.prototype.init = function () {
        var that = this;

        that.initMoreOptionsLink();

        if (that.is_new) {
            that.setReleasesType();
        }

        that.initProjectSelector();
        that.initMilestoneSelector();
        that.initValidateTaskType();
    };

    TaskExtEdit.prototype.initMoreOptionsLink = function () {
        var that = this,
            $wrapper = that.$wrapper,
            $link = that.$link,
            $block = that.$block,
            $task = $wrapper.closest('.t-task-page-wrapper'),
            storage_key = 'tasks/plugin/releases/expanded';

        // HELPERS

        var hideEmptyFields = function () {
            $block.find(':input').each(function () {
                var $input = $(this),
                    val = $.trim($input.val() || '');
                if (!val) {
                    $input.closest('.field').hide();
                    $input.attr('disabled', true);
                }
            });
        };

        var showAllFields = function () {
            var $inputs = $block.find(':input');
            $inputs.attr('disabled', false);
            $inputs.closest('.field').show();
        };

        var isAllFilled = function () {
            var $inputs = $block.find(':input'),
                is_all_filled = true;
            $inputs.each(function () {
                var $input = $(this),
                    val = $.trim($input.val() || '');
                if (!val) {
                    is_all_filled = false;
                    return false;
                }
            });
            return is_all_filled;
        };
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
            showAllFields();
            arrUp();
        };
        var collapse = function () {
            that.storage.del(storage_key, 1);
            hideEmptyFields();
            arrDown();
        };

        // init state
        if (that.storage.get(storage_key)) {
            expand();
        } else {
            collapse();
        }

        // append link to button section
        $task.find('.t-buttons-block').append($link.show());
        $task.find('.t-more-fields-wrapper').show();

        // click expand/collapse handler
        $link.click(function (e) {
            e.preventDefault();
            if (isArrDown()) {
                expand();
            } else {
                collapse();
            }
        });

        if (isAllFilled()) {
            $link.hide();
        }

        // showtime
        $block.show();

        // show fields(affected_version, resolution) depending on task type
        $task.find('.js-task-type-hidden').on('change', function() {
            var type_vall = $(this).val();

            if (type_vall!='bug' && type_vall!='sr'){
                $task.find('.js-affected_version-wrapper').hide();
                $task.find('.js-gravity').hide();
            }else{
                if ($task.find('.js-affected_version-wrapper input').is(':disabled')) {
                    $task.find('.js-affected_version-wrapper input').removeAttr('disabled');
                }
                if ($task.find('.js-resolution-wrapper select').is(':disabled')) {
                    $task.find('.js-resolution-wrapper select').removeAttr('disabled');
                }
                if ($task.find('.js-gravity select').is(':disabled')) {
                    $task.find('.js-gravity select').removeAttr('disabled');
                }
                $task.find('.js-affected_version-wrapper').show();
                $task.find('.js-gravity').show();
            }
        });

        // Set time (plan&fact) on hours and days
        var $select_plan = $task.find('.js-select-plan-period'),
            $select_fact = $task.find('.js-select-fact-period'),
            $time_plan = $task.find('.js-time-plan'),
            $time_fact = $task.find('.js-time-fact'),
            $hidden_time_plan = $task.find('.js-time-plan-hidden'),
            $hidden_time_fact = $task.find('.js-time-fact-hidden');

        $time_plan.on("change", function() {
            calculate($(this), $select_plan, $hidden_time_plan);
        });

        $time_fact.on("change", function() {
            calculate($(this), $select_fact, $hidden_time_fact);
        });

        $select_plan.on("change", function() {
            calculate($time_plan, $(this), $hidden_time_plan);
        });

        $select_fact.on("change", function() {
            calculate($time_fact, $(this), $hidden_time_fact);
        });

        setData($time_plan, $select_plan, $hidden_time_plan);
        setData($time_fact, $select_fact, $hidden_time_fact);

        function calculate($time, $period, $hidden_field) {
            var count = parseInt( $time.val() ),
                period = parseInt( $period.val() ),
                result = null;

            if (count >= 0 && period) {
                result = count * period;
            }

            $hidden_field.val(result);
        }

        function setData($time, $period, $hidden_field) {
            var value = $hidden_field.val();
            if (parseInt(value) >= 0) {
                if ((parseInt(value) % 8) === 0) {
                    $period.val("8");
                    $time.val( parseInt(value)/8 );
                } else {
                    $period.val("1");
                }
            }
        }

    };

    TaskExtEdit.prototype.setReleasesType = function () {
        var that = this,
            $task = that.$wrapper.closest('.t-task-page-wrapper'),
            filter_params = localStorage.getItem('tasks/inbox_filters');

        if (filter_params) {
            filter_params = filter_params.split('&');

            $.each(filter_params, function (index, item) {
                var param_value = item.split('=');

                if (param_value[0] == 'task.type') { // set task type
                    var $task_types_list = $task.find('.js-task-types-list .js-type-item');

                    if ($task_types_list.length) {
                        var $type_hidden = $task.find('.js-task-type-hidden'),
                            $selected_type = $task.find('.js-selected-type .js-selected-item');

                        $task_types_list.each(function () {
                            var $type = $(this).find('.js-custom-select'),
                                $type_id = $type.data('value');

                            if ($type_id == param_value[1]) {
                                $selected_type.html($type.html());
                                $type_hidden.val(param_value[1]);
                                $(document).ready(function () {
                                    $type_hidden.change();
                                });
                            }

                        });
                    }
                }

                if (param_value[0] == 'task.gravity') { // set task gravity
                    var $gravity = $task.find('select[name="task_ext[gravity]"]');

                    if ($gravity.length) {
                        $gravity.find('option').each(function () {
                            var $option = $(this);

                            if (param_value[1]) {
                                if ($option.val() == param_value[1]) {
                                    $gravity.val(param_value[1]).change();
                                }
                            }
                        });
                    }

                }
            });
        }
    };

    TaskExtEdit.prototype.initValidateTaskType = function () {
        var that = this,
            $wrapper = that.$wrapper,
            $link = that.$link,
            $task = $wrapper.closest('.t-task-page-wrapper'),
            $form = $task.find('#t-edit-task-form');

        $form.on( "task_before_submit", function(event) {
            var task_type = $task.find('.js-task-type-hidden').val();
            event.preventDefault();

            if (!task_type) {
                $task.find('.js-errors-block').html('<span style="color: red;">Please select task type</span>');
                $form.data('validate',false);
            }else{
                if (task_type == 'bug' || task_type == 'sr'){

                    //show gravity fields
                    if ($task.find('.t-more-fields-wrapper').is(":hidden")) {
                        $link.click();
                    }

                    if (!$task.find('.js-gravity select').val()) {
                        $task.find('.js-errors-block').html('<span style="color: red;">Please select task gravity</span>');
                        $task.find('.js-gravity select').css("border","1px solid red");
                        $form.data('validate',false);
                    }else{
                        $form.data('validate', true);
                    }
                }else{
                    $form.data('validate', true);
                }
            }

            setTimeout( function() {
                $task.find(".js-errors-block").html('');
            }, 3000);

        });

        $task.find('.js-gravity select').on("change", function () {
            $(this).css("border","1px solid #a9a9a9");
        });

    };
    TaskExtEdit.prototype.initProjectSelector = function () {
        var that = this,
            $editor = that.$editor,
            $project_selector = $editor.find('.t-project-select'),
            $project_id = $editor.find('input[name="data[project_id]"]');

        that.project_id = $project_id.val();
        $project_selector.off('click.' + that.ns).on('click.' + that.ns,
            function () {
                setTimeout(function () {
                    var project_id = $project_id.val();
                    if (that.project_id != project_id) {
                        that.project_id = $project_id.val();
                        that.updateMilestoneSelector();
                    }
                }, 150);
            }
        );
    };

    TaskExtEdit.prototype.updateMilestoneSelector = function (milestone_id) {
        var that = this,
            $editor = that.$editor,
            $selector = $editor.find('.t-milestone-wrapper'),
            selector = $selector.data('dropDownMenu'),
            milestones = that.milestones,
            project_id = toInt(that.project_id);

        if (!selector) {
            selector = new TasksDropDownMenu($selector, {
                $hidden: $selector.find('.js-milestones-hidden')
            });
        }

        var enabled_options_count = 0;
        selector.eachOption(function (id) {
            // empty option
            if (!id) {
                return;
            }

            var milestone = milestones[id],
                related_projects = milestone ? (milestone.related_projects || []) : [];

            if (related_projects.indexOf(project_id) >= 0) {
                enabled_options_count++;
                selector.enableItem(id);
                if (milestone_id > 0 && milestone_id !== null && milestone_id == id) {
                    selector.setSelected(id);
                }
            } else {
                selector.disableItem(id);
            }
        });

        if (enabled_options_count) {
            $selector.show();
        }
    };

    TaskExtEdit.prototype.initMilestoneSelector = function () {
        var that = this,
            $editor = that.$editor,
            $selector = $editor.find('.t-milestone-wrapper'),
            selector = $selector.data('dropDownMenu');
        if (!selector) {
            new TasksDropDownMenu($selector, {
                $hidden: $selector.find('.js-milestones-hidden')
            });
        }
        that.updateMilestoneSelector(that.task.id > 0 ? that.task.milestone_id : null);
    };

    return TaskExtEdit;

})(jQuery);
